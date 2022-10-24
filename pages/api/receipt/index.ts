import { Prisma, PrismaClient, Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { receiptWithAll, receiptWithPerson } from 'prisma/queries'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { GetReceiptWithPersonResponse } from 'types/receipt'
import { canUnserDo } from 'utils/checkPermissions'
import { intSearch, routePaginate, stringSearch } from 'utils/routePaginate'
// GET|POST /api/receipt
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(
  req: NextApiRequest,
  res: NextApiResponse<GetReceiptWithPersonResponse | string | Receipt>
) {
  const { body, method, query, session } = req

  switch (method) {
    case 'GET':
      if (!canUnserDo(session, 'READ_RECEIPT')) return res.status(403).send(`Can't read this.`)
      try {
        const response = await getReceipts(query, prisma)
        res.json(response)
      } catch (error) {
        res.status(500).end(`Hubo un error:\n${JSON.stringify(error, null, 2)}`)
      }
      break

    case 'POST':
      if (!canUnserDo(session, 'CREATE_RECEIPT')) return res.status(403).send(`Can't create this.`)
      //creamos UN recibo
      try {
        //validate

        const validBody = receiptCreateSchemaInput.safeParse(body)
        if (!validBody.success) {
          console.log({ validBody })
          return res.status(403).end(`Error, not all data send`)
        }

        if (
          !validBody.data.products &&
          !validBody.data.billings /* sí NO hay productos y Sí NO hay facturas, daré error */
        ) {
          console.log({ validBody })
          return res.status(403).send(`Bad Request, not billings or products found`)
        }
        // preparamos los 'Productos cobrados'
        let chargedProductData: Prisma.ProductSaleCreateManyReceiptInput[] = []

        if (validBody.data.billings) {
          // Si el if da true, existen billing, entonces los usaremos para crear los cargos.
          //crear a partir de billing
          const { billings } = validBody.data

          // Generamos un arreglo de chargeProduct y cambiamos el estado 'isCharged' del 'billing' a true. SIN el Id de Receipt.
          const data = await Promise.all(
            billings.map(async (billingId) => {
              const billing = await prisma.billing.update({
                data: { isCharged: true },
                where: { id: billingId },
                select: { amount: true, productId: true }
              })

              return {
                price: billing.amount,
                productId: billing.productId,
                billingId: billingId
              } as Prisma.ProductSaleCreateManyReceiptInput
            })
          )

          //concatenamos la data al arreglo externo a la validación
          chargedProductData = [...chargedProductData, ...data]
        }

        if (validBody.data.products /* sí hay productos, entraré */) {
          //en caso de que sí existan los productos.
          // Creamos a partir de productos
          const { products } = validBody.data

          // Generamos un arreglo de chargeProduct, buscando la información en la base de datos primero. SIN el Id de Receipt.
          const data = await Promise.all(
            products.map(async ({ id, quantity }) => {
              const product = await prisma.product.findFirst({
                where: { id }
              })

              return {
                price: product?.price,
                productId: id,
                quantity
              } as Prisma.ProductSaleCreateManyReceiptInput
            })
          )
          chargedProductData = [...chargedProductData, ...data]
        }

        // Preparamos los datos de los cargos a crear/subir con el recibo :D
        console.log(chargedProductData)
        const chargesData: Prisma.ChargeCreateManyReceiptInput[] = validBody.data.charges.map(
          (charge) => {
            const { amount, paymentMethod } = charge
            const { conversion, id, metaPayment } = paymentMethod
            return {
              amount,
              conversionId: conversion,
              paymentMethodId: id,
              metaPayment
            } as Prisma.ChargeCreateManyReceiptInput
          }
        )
        const charges: Prisma.ChargeCreateNestedManyWithoutReceiptInput = {
          create: chargesData
        }

        const chargedProducts = {
          createMany: { data: chargedProductData }
        }
        // Preparamos el cuerpo para crear el recibo
        const receiptInput: Prisma.ReceiptCreateArgs = {
          data: {
            amount: validBody.data.amount,
            chargedProducts,
            personId: validBody.data.person,
            charges
          },
          ...receiptWithAll
        }

        // console.log(JSON.stringify({ receiptInput }, null, 2))
        // Creamos el recibo
        const result = await prisma.receipt.create(receiptInput)

        res.status(201).send(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}

const getReceipts = async (
  query: NextApiRequestQuery,
  prisma: PrismaClient
): Promise<GetReceiptWithPersonResponse> => {
  const { keyword, document } = query
  const searchQuery = stringSearch(keyword) || stringSearch(document)

  // obtenemos TODOS los productos
  const where: Prisma.ReceiptWhereInput = keyword
    ? {
        OR: [
          { person: { docNumber: searchQuery } },
          { person: { firstName: searchQuery } },
          { person: { middleName: searchQuery } },
          { person: { secondLastName: searchQuery } },
          { person: { firstLastName: searchQuery } },
          { id: intSearch(keyword) }
        ]
      }
    : {}

  const count = await prisma.receipt.count({ where })
  //obtenemos TODOS los recibos
  // Recibos con información escencial de la persona
  const result = await prisma.receipt.findMany({
    ...receiptWithPerson,
    ...routePaginate(query),
    where,
    orderBy: {
      id: 'desc'
    }
  })
  console.log(result)
  return { count, result }
}

/*
recibimos todos los datos del front 
necesitamos:

para el recibo:
- id de la persona
- monto total del recibo

para cada cargo: 
- id de cada payment_method
- monto que se cobró por ese método
- id del recibo
- id de la conversión
- la meta data del payment_method

para cada product_receipt: 
- id del producto 
- id del billing
- monto del billing
- id del recibo
- cantidad del producto (si aplica)

validamos su existencia 
*/
// podría extraer data de isValid para facilitar la comprensión.
/*
body:{
  amount: float,
  person: { id : number} | number,
  product: {
    id: number,
    quantity : number | undefined,
  },
  billing : number[] | undefined,
  charge: [{
    amount : float,
    payment_method : {
      id: number,
      meta_data : object, 
      conversion: id
    }
  }],
}
*/
// utilizar producto para crear los receipt_product
/*
casos que manejar: 
- sí no tiene productos, tiene billing, entonces usar billing para buscar el nombre del producto (mensualidad del mes tal...) y su información
- si tiene producto y no tieen billing, entonces usar el producto para buscar toda la info requerida
- si envian un producto y un billing diferentes a usar?
*/
/*
organizamos y mapeamos
registramos el recibo
registramos los cargos
cambiamos el estado de los facturados (billing) a true + creación de la relación entre el billing y el estudiante.
Devolvemos el recibo como un GET receipt/[id]
*/
// const result = await prisma.receipt.create({
//   data: {
//     amount,
//     personId,
//     charges: { createMany: [{ amount, date, conversionId, paymentMethodId, metaPayment }] },
//     chargedProducts: { createMany: [{ productId, quantity, price, billingId }] }
//   }
// })
