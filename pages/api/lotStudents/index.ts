import { Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import dayjs from 'lib/dayjs'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { MetaPaymentData, MetaPaymentDef } from 'types/paymentMethod'
import { CreateReceiptInput } from 'types/receipt'
import { insertReceipt } from 'utils/insertReceipt'
import { stringSearch } from 'utils/routePaginate'
import XLSX from 'xlsx'

const SUNDAY = 0
const FRIDAY = 5
const SATURDAY = 6

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // obtenemos los datos en un formate manejable.
      const { dataCell } = handleBody(req.body)
      const byDocNumber = parseData(dataCell)
      const receiptArr: Receipt[] = []
      for (const docNum in byDocNumber) {
        const student = await prisma.student.findFirstOrThrow({
          select: { personId: true },
          where: { person: { docNumber: { equals: docNum } } }
        })

        const rows = byDocNumber[docNum] //tomamos el array de filas referentes al estudiante.
        const billings: CreateReceiptInput['billings'] = []
        const products: CreateReceiptInput['products'] = []
        const charges: CreateReceiptInput['charges'] = []
        let receiptAmount = 0

        for (const row of rows) {
          const billing = await prisma.billing.findFirst({
            select: { id: true, amount: true, isCharged: true },
            where: {
              productName: stringSearch(row.productName),
              isCharged: false,
              student: { personId: student.personId }
            }
          })
          const product = await prisma.product.findFirst({
            select: { id: true, price: true },
            where: { name: stringSearch(row.productName) }
          })
          let amount: number
          if (billing) {
            billings.push(billing.id)
            amount = billing.amount
          } else if (product) {
            products.push({ id: product.id, quantity: row.quantity })
            amount = product.price
          } else {
            throw new Error('Billing or Product not Found')
          }
          //Cobros
          const paymentMethod = await prisma.paymentMethod.findFirstOrThrow({
            select: { id: true, metaPayment: true },
            where: { name: stringSearch(row.paymentMethod) }
          })
          const metaPayment = (paymentMethod.metaPayment as MetaPaymentDef[])?.map(
            (metaPayment: MetaPaymentDef) => {
              return {
                name: metaPayment.name,
                fieldType: metaPayment.fieldType,
                value: row[metaPayment.name as keyof typeof row] // viene de la row
              } as MetaPaymentData
            }
          )
          let date = dayjs(row.fecha)
          const day = date.day()
          if (day === SATURDAY || day === SUNDAY) date = date.subtract(day - FRIDAY, 'day')
          const gt = date.set('h', 0).set('m', 0).set('s', 0).set('ms', 0).toDate()
          const lt = date.set('h', 23).set('m', 59).set('s', 59).set('ms', 999).toDate()
          const conversion = await prisma.conversion.findFirstOrThrow({
            select: { id: true, dolar: true },
            where: { date: { lt, gt } },
            orderBy: { date: 'desc' }
          })
          //Convertimos en bolívares el valor del producto
          const amountConv = amount * conversion.dolar
          if (amountConv > row.amount)
            throw new Error(` the value: ${amountConv} is greater than ${row.amount} validate.`)
          // Acumulamos el monto del cobro para el recibo
          receiptAmount += amount
          charges.push({
            paymentMethod: { metaPayment, id: paymentMethod.id, conversion: conversion.id },
            amount
          })
        }

        // if (charges.length < 0 || !(billings.length < 0) || products.length < 0)
        //   throw new Error(`Charges, billing or products it's empty`)

        const receiptData: CreateReceiptInput = {
          billings,
          charges,
          products,
          person: student.personId,
          amount: receiptAmount
        }
        // console.log(JSON.stringify({ receiptData }, null, 2))
        const receipt = await insertReceipt(receiptData)
        console.log({ receipt })
        receiptArr.push(receipt)
      }
      // const result = {}
      // Preparamos las queries a realizar
      res.json({ receiptArr })
    } catch (error) {
      console.error(error)
      res.send({ error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
/**
 * Enpoint temporal para la creación de la lógica de cargar un excel con muchos cobros.
 * Para lograr esto requerimos dos partes de lógica.
 * En el front, surtir una interface con un uploader de archivos EXCEL
 * (SOLO 'Hojas de Cálculo' o CSV, aún por definir las extensiones a admitir, falta buscar una lib que lo haga)
 * en el back, se recibirá un POST con el archivo suministrado y se parseará a javascript Object.
 *
 * Se extrae la data de este y se iterará por 'ROW' ? (Filas)
 *
 * Cada fila será un producto. A no ser que se vea una forma de generar args ilimitados por columnas
 * (a partir de una en particular)
 *
 * Al iterar, se debe almacenar una referencia al campo que se está leyendo en todo momento, en caso de error devolver
 * un mensaje amigable con esta referencia para su correción Incluso poder facilitar observaciones de posibles errores.
 *
 * Se validará que la data sea consistente y no se haya cobrado anteriormente
 * (al menos que el último cobro no haya sido demasiado similar persona/monto/fecha/metpago/algún otro valor que determinemos clave)
 *
 * Antes/durante/después de la validación, se organizarán los cobros para realizar el mínimo número de recibos por estudiantes
 * generando así un recibo por estudiante/persona en el archivo de ser posible
 *
 * Por cada recibo que se genere se ha de mandar a 'imprimir' dicho recibo y entregarlo en PDF
 * o bien enviarlo directamente a un correo que estará indicado en el archivo cargado / registrado en el sistema
 *
 * Buscar la manera (de ser posible) de mostar el progreso en el frontend. Caso contrario dar un loading y entregar
 * respuesta de éxito o error.
 *
 * En caso de error NADA debería de hacerse. (todo el proceso debería de invertirse y no tocar nada.)
 *
 */

/**
 * manejo del cuerpo de la request para convertir el archivo en un objeto manejable
 * con XLSX
 */
const handleBody = (body: NextApiRequest['body']) => {
  //Leemos el cuerpo y formateamos a un workBook, básicamente a un objeto manejable en js
  const workBook = XLSX.read(body, {
    type: 'base64',
    cellDates: true,
    cellFormula: true,
    dense: true
  })
  const sheetName = workBook.SheetNames[0]
  const workSheet = workBook.Sheets[sheetName]['!data']

  const rows = workSheet?.map((row, index, arr) => {
    const r = index
    return row
      .map((col, index) => {
        const c = index
        const cell = col.v || col.w
        const addr = XLSX.utils.encode_cell({ r, c })
        const prop = XLSX.utils.format_cell(arr[0][c])
        return { [prop]: cell, [`${prop}_addr`]: addr }
      })
      .reduce((row, cell) => {
        return { ...row, ...cell }
      }, {})
  })

  // eliminamos el registro 0 (cabecera)
  rows?.shift()
  //Devolvemos el workbook inicial y el dataCell formateado.
  return { workBook, dataCell: rows }
}

const parseData = (
  dataCell: { [x: string]: string | number | Date | boolean | undefined }[] | undefined
) => {
  if (!dataCell) throw Error(`not dataCell`)
  const rows = dataCell.map((row) => {
    const person = row['cedula'] as string
    if (!person) throw new Error(`not found data in ${row['cedula_addr']}`)
    const productPrice = row['precio'] as number
    if (!productPrice) throw new Error(`not found data in ${row['precio_addr']}`)
    const quantity = row['cantidad'] as number
    if (!quantity) throw new Error(`not found data in ${row['cantidad_addr']}`)
    const paymentMethod = row['metodo_de_pago'] as string
    if (!paymentMethod) throw new Error(`not found data in ${row['metodo_de_pago_addr']}`)
    const amount = row['monto_cobrado'] as number
    if (!amount) throw new Error(`not found data in ${row['monto_cobrado_addr']}`)
    const referencia = row['referencia'] as string
    if (!referencia) throw new Error(`not found data in ${row['referencia_addr']}`)
    const fecha = new Date(row['fecha'] as unknown as Date)
    if (!fecha) throw new Error(`not found data in ${row['fecha_addr']}`)
    const productName =
      row['producto'] == 'mensualidad'
        ? `${row['mensualidad']} ${row['semestre']}`
        : (row['producto'] as string)
    if (!productName)
      throw new Error(
        `not fount data in ${
          row['producto'] === 'mensualidad'
            ? `${row['mensualidad_addr']} ó ${row['semestre_addr']}`
            : row['product_addr']
        }`
      )
    return {
      person,
      productPrice,
      quantity,
      paymentMethod,
      amount,
      referencia,
      fecha,
      productName
    }
  })
  return _.groupBy(rows, 'person')
}
