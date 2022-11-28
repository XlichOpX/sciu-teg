import { Currency, Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import dayjs from 'lib/dayjs'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sheetSchema } from 'schema/batchImportSchema'
import type { MetaPaymentData, MetaPaymentDef } from 'types/paymentMethod'
import { CreateReceiptInput } from 'types/receipt'
import { rowSheet, SheetData } from 'types/utils'
import validateBody from 'utils/bodyValidate'
import { insertReceipt } from 'utils/insertReceipt'
import { stringSearch } from 'utils/routePaginate'
// import XLSX from 'xlsx'

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req
  if (method === 'POST') {
    console.log({ body })
    try {
      const { data } = await validateBody(body, sheetSchema)
      // // obtenemos los datos en un formate manejable.

      // const { dataCell } = handleBody(body)
      const parsedData = await parseData(data)
      if (!parsedData) throw new Error(`error`)
      console.log({ parsedData })
      const byDocNumber = _.groupBy(parsedData, 'cedula')
      const receiptArr: Receipt[] = []
      console.log({ byDocNumber })
      for (const docNum in byDocNumber) {
        // iteramos, por cada agrupación por identificación

        //se obtiene el estudiante para saber el ID de la persona y si es un estudiante válido
        const student = await prisma.student.findFirst({
          select: { personId: true },
          where: { person: { docNumber: { equals: docNum } } }
        })
        if (!student) throw new Error(`no student ${docNum} found`)
        // llamar a Billings para 'preparar' posibles cobros/retardos

        // preparamos las propiedades del recibo
        const rows = byDocNumber[docNum] //tomamos el array de filas referentes al estudiante.
        const billings: CreateReceiptInput['billings'] = []
        const products: CreateReceiptInput['products'] = []
        const charges: CreateReceiptInput['charges'] = []
        let receiptAmount = 0
        console.log(rows)
        // Iteramos cada fila del excel asociada al estudiante para preparar los productos, facturación y cobros
        for (const row of rows) {
          // Billing y Productos
          let billing
          let product
          let amount: number
          if (row.mensualidad && row.semestre) {
            billing = await prisma.billing.findFirst({
              select: { id: true, amount: true, isCharged: true, productName: true },
              where: {
                AND: [
                  {
                    productName: {
                      contains: row.producto,
                      mode: 'insensitive'
                    }
                  },
                  {
                    productName: {
                      contains: row.mensualidad,
                      mode: 'insensitive'
                    }
                  },
                  {
                    productName: {
                      contains: row.semestre,
                      mode: 'insensitive'
                    }
                  },
                  { isCharged: { equals: false } },
                  { student: { personId: student.personId } }
                ]
              }
            })

            if (!billing) throw new Error('billing not found')

            billings.push(billing.id)
            if (billing.amount === row.precio) amount = row.precio
            else
              throw new Error(
                `El precio ${row.precio} no corresponde al pendiente por pagar en: ${billing.productName}`
              )
          } else {
            product = await prisma.product.findFirst({
              select: { id: true, price: true },
              where: { name: stringSearch(row.producto) }
            })
            if (!product) throw new Error('product not found')
            products.push({ id: product.id, quantity: row.cantidad })
            amount = row.precio
          }

          //Cobros
          const paymentMethod = await prisma.paymentMethod.findFirst({
            select: {
              id: true,
              metaPayment: true
            },
            where: { name: stringSearch(row.metodo_de_pago) }
          })
          if (!paymentMethod) throw new Error(`No PaymentMethod ${row.metodo_de_pago} found`)

          const metaPayment = (paymentMethod.metaPayment as MetaPaymentDef[])?.map(
            (metaPayment: MetaPaymentDef) => {
              return {
                name: metaPayment.name,
                fieldType: metaPayment.fieldType,
                value: row[metaPayment.name as keyof typeof row]
              } as MetaPaymentData
            }
          )

          const date = dayjs(row.fecha)
          const lte = date.set('h', 23).set('m', 59).set('s', 59).set('ms', 999).toDate()
          const conversion = await prisma.conversion.findFirst({
            // dolar, euro, libra, bolivares, etc...
            select: { id: true, value: true },
            where: { date: { lte }, id: row.moneda },
            orderBy: { date: 'desc' }
          })
          if (!conversion) throw new Error(`no conversion for currency ${row.moneda} found`)
          // Convertimos en bolívares el valor del producto para validar que está dentro del monto pasado en el excel
          const amountConv = amount * conversion.value

          if (amountConv > row.monto_cobrado)
            throw new Error(
              `For doc number ${row.cedula} student the value: ${amountConv} is greater than ${row.monto_cobrado} validate.`
            )

          // Acumulamos el monto del cobro para el recibo
          receiptAmount += amount

          // validamos si existe ya un cobro con el mismo método de pago asociado y la misma referencia...
          const index = charges.findIndex((charge) =>
            charge.paymentMethod.metaPayment?.some(
              (mp) => mp.name === 'referencia' && mp.value === row.referencia
            )
          )

          if (index !== -1) {
            charges[index].amount += amount
          } else {
            // encaso de que no exista, creamos un nuevo cobro...
            charges.push({
              paymentMethod: { metaPayment, id: paymentMethod.id },
              amount,
              currencyId: row.moneda
            })
          }
        }
        // validamos que los cobros estén correctos
        const tChargeAmount = charges.reduce((t, charge) => {
          return (t += charge.amount)
        }, 0)
        if (tChargeAmount > rows[0].monto_cobrado)
          throw new Error(
            `El monto cobrado es menor al esperado. Verifique el estudiante identificación: ${docNum}`
          )
        // declaramos la agrupación de información contenida en un recibo
        const receiptData: CreateReceiptInput = {
          billings,
          charges,
          products,
          person: student.personId,
          amount: receiptAmount
        }
        // generamos el recibo y lo introducimos en el arreglo de recibos creados
        console.log(receiptData)
        const receipt = await insertReceipt(receiptData)
        console.log(receipt)
        receiptArr.push(receipt)
      }
      // Una vez iterado todos los grupos de recibos se devuelve un arreglo con toda la información de estos al frontend
      res.json(receiptArr)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message)
      } else {
        res.status(400).send(error)
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

/**
 * Recibe el arreglo de filas y extrae la información necesaria y elimina los espacios innecesarios de los strings
 * Así como ordena en un objeto docNum -> Array de columnas para facilitar la iteración de estos
 * @param { SheetData } SheetData
 * @returns
 */
const parseData = async ({ data, headings }: SheetData) => {
  try {
    const currencies = await prisma.currency.findMany({
      select: { id: true, name: true, symbol: true }
    })
    // iteramos cada fila...
    return data.map((row) => {
      // iteramos cada columna
      return Object.fromEntries(
        row.map((field, index) => {
          if (headings[index] === 'moneda') {
            const cur = findCurrency(currencies, field as string)
            if (cur) field = cur
            else {
              throw new Error(`The moneda ${row[index]} is not a valid moneda`)
            }
          }
          return [headings[index], field]
        })
      ) as rowSheet
    })
  } catch (error) {
    console.log(error)
  }
}

function findCurrency(currencies: Pick<Currency, 'id' | 'name' | 'symbol'>[], field: string) {
  return currencies.find((currency) => {
    const isSymbol = currency.symbol.toLocaleLowerCase() === field.toLocaleLowerCase()
    const isName = currency.name.includes(field.toLocaleLowerCase())
    return isSymbol || isName
  })?.id
}
