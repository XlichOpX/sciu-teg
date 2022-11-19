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
        const student = await prisma.student.findFirstOrThrow({
          select: { personId: true },
          where: { person: { docNumber: { equals: docNum } } }
        })
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
          const productName =
            row.producto.toLocaleLowerCase().includes('mensualidad') ||
            row.producto.toLocaleLowerCase().includes('retardo')
              ? `${row.producto.trim()} de ${row.mensualidad?.trim()} ${row.semestre?.trim()}`
              : row.producto.trim()

          const matchedBillings = await prisma.billing.findMany({
            select: { id: true, amount: true, isCharged: true, productName: true },
            where: {
              productName: stringSearch(productName),
              isCharged: { equals: false },
              student: { personId: student.personId }
            }
          })

          const billing =
            matchedBillings.length <= 1
              ? matchedBillings[0]
              : matchedBillings.filter((bill) =>
                  bill.productName.toLocaleLowerCase().includes(productName.toLocaleLowerCase())
                )[0]

          const product = await prisma.product.findFirst({
            select: { id: true, price: true },
            where: { name: stringSearch(productName) }
          })

          let amount: number
          if (billing) {
            billings.push(billing.id)
            if (billing.amount === row.precio) amount = row.precio
            else
              throw new Error(
                `El precio ${row.precio} no corresponde al pendiente por pagar en: ${billing.productName}`
              )
          } else if (product) {
            products.push({ id: product.id, quantity: row.cantidad })
            amount = row.precio
          } else {
            throw new Error('Billing and Product not Found')
          }

          //Cobros
          const paymentMethod = await prisma.paymentMethod.findFirstOrThrow({
            select: {
              id: true,
              metaPayment: true
            },
            where: { name: stringSearch(row.metodo_de_pago) }
          })

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
          const conversion = await prisma.conversion.findFirstOrThrow({
            // dolar, euro, libra, bolivares, etc...
            select: { id: true, value: true },
            where: { date: { lte }, id: row.moneda },
            orderBy: { date: 'desc' }
          })
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
 * manejo del cuerpo de la request para convertir el archivo (codeado en Base64)
 * en un objeto manejable con la librería XLSX
 */
// const handleBody = (body: NextApiRequest['body']) => {
//   //Leemos el cuerpo y formateamos a un workBook, un objeto manejable en js
//   const workBook = XLSX.read(body, {
//     type: 'base64',
//     cellDates: true,
//     cellFormula: true,
//     dense: true
//   })
//   const sheetName = workBook.SheetNames[0]
//   const workSheet = workBook.Sheets[sheetName]['!data']
//   if (!workSheet) throw new Error('not Worksheet initiated')

//   const rows = workSheet.map((row, index, arr) => {
//     const r = index //row Index
//     return row
//       .map((col, index) => {
//         // convertimos cada fila en un arreglo [col]: valor
//         const c = index //col Index
//         let cell = col.v || col.w
//         if (typeof cell === 'string') cell = cell.toLocaleLowerCase().trim()

//         const addr = XLSX.utils.encode_cell({ r, c })
//         const prop = XLSX.utils.format_cell(arr[0][c])
//         return { [prop]: cell, [`${prop}_addr`]: addr }
//       })
//       .reduce((row, cell) => {
//         // reducimos la matriz a un solo arreglo de objetos [col]: valor
//         return { ...row, ...cell }
//       }, {})
//   })

//   // eliminamos el registro 0 (cabecera)
//   rows.shift()
//   //Devolvemos el dataCell formateado.
//   return { dataCell: rows }
// }

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
// (
//   dataCell: { [x: string]: string | number | Date | boolean | undefined }[] | undefined
// ) => {
//   if (!dataCell) throw Error(`not dataCell`)
//   const rows = dataCell.map((row) => {
//     const person = row['cedula'] as string
//     if (!person) throw new Error(`not found data in ${row['cedula_addr']}`)
//     const productPrice = row['precio'] as number
//     if (!productPrice) throw new Error(`not found data in ${row['precio_addr']}`)
//     const quantity = row['cantidad'] as number
//     if (!quantity) throw new Error(`not found data in ${row['cantidad_addr']}`)
//     const paymentMethod = row['metodo_de_pago'] as string
//     if (!paymentMethod) throw new Error(`not found data in ${row['metodo_de_pago_addr']}`)
//     const amount = row['monto_cobrado'] as number
//     if (!amount) throw new Error(`not found data in ${row['monto_cobrado_addr']}`)
//     const referencia = row['referencia'] as string
//     if (!referencia) throw new Error(`not found data in ${row['referencia_addr']}`)
//     const fecha = new Date(row['fecha'] as unknown as Date)
//     if (!fecha) throw new Error(`not found data in ${row['fecha_addr']}`)
//     const productName =
//       row['producto'] == 'mensualidad'
//         ? `${row['producto']} de ${row['mensualidad']} ${row['semestre']}`
//         : (row['producto'] as string)
//     if (!productName)
//       throw new Error(
//         `not fount data in ${
//           row['producto'] === 'mensualidad'
//             ? `${row['mensualidad_addr']} ó ${row['semestre_addr']}`
//             : row['product_addr']
//         }`
//       )
//     return {
//       person,
//       productPrice,
//       quantity,
//       paymentMethod,
//       amount,
//       referencia,
//       fecha,
//       productName
//     }
//   })
//   return _.groupBy(rows, 'person')
// }

/**
 * Endpoint temporal para la creación de la lógica de cargar un excel con muchos cobros.
 * Para lograr esto requerimos dos partes de lógica.
 * En el front, surtir una interface con un uploader de archivos EXCEL
 * (SOLO 'Hojas de Cálculo' o CSV, aún por definir las extensiones a admitir, falta buscar una lib que lo haga)
 * en el back, se recibirá un POST con el archivo suministrado y se transforma a javascript Object.
 *
 * Se extrae la data de este y se iterará por 'ROW' ? (Filas)
 *
 * Cada fila será un producto. A no ser que se vea una forma de generar args ilimitados por columnas
 * (a partir de una en particular)
 *
 * Al iterar, se debe almacenar una referencia al campo que se está leyendo en todo momento, en caso de error devolver
 * un mensaje amigable con esta referencia para su corrección Incluso poder facilitar observaciones de posibles errores.
 *
 * Se validará que la data sea consistente y no se haya cobrado anteriormente
 * (al menos que el último cobro no haya sido demasiado similar persona/monto/fecha/método de pago/algún otro valor que determinemos clave)
 *
 * Antes/durante/después de la validación, se organizarán los cobros para realizar el mínimo número de recibos por estudiantes
 * generando así un recibo por estudiante/persona en el archivo de ser posible
 *
 * Por cada recibo que se genere se ha de mandar a 'imprimir' dicho recibo y entregarlo en PDF
 * o bien enviarlo directamente a un correo que estará indicado en el archivo cargado / registrado en el sistema
 *
 * Buscar la manera (de ser posible) de mostrar el progreso en el frontend. Caso contrario dar un loading y entregar
 * respuesta de éxito o error.
 *
 * En caso de error NADA debería de hacerse. (todo el proceso debería de invertirse y no tocar nada.)
 *
 */
