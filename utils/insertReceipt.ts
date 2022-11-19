import { Prisma, Receipt } from '@prisma/client'
import prisma from 'lib/prisma'
import { receiptWithAll } from 'prisma/queries'
import { CreateReceiptInput } from 'types/receipt'

export const insertReceipt = async (body: CreateReceiptInput) => {
  const result = (await prisma.$transaction(async (tc) => {
    //validate
    if (
      !body.products &&
      !body.billings /* sí NO hay productos y Sí NO hay facturas, daré error */
    ) {
      throw new Error(`Bad Request, not billings or products found`) // 400
    }
    // preparamos los 'Productos cobrados'
    let chargedProductData: Prisma.ProductSaleCreateManyReceiptInput[] = []

    if (body.billings) {
      // Si el if da true, existen billing, entonces los usaremos para crear los cargos.
      //crear a partir de billing
      const { billings } = body
      // arreglo de ids
      // Generamos un arreglo de chargeProduct y cambiamos el estado 'isCharged' del 'billing' a true. SIN el Id de Receipt.
      const data = await Promise.all(
        billings.map(async (billingId) => {
          const billing = await tc.billing.update({
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

    if (body.products /* sí hay productos, entraré */) {
      // En caso de que sí existan los productos.
      // Creamos a partir de productos
      const { products } = body

      // Generamos un arreglo de chargeProduct, buscando la información en la base de datos primero. SIN el Id de Receipt.
      const data = await Promise.all(
        products.map(async ({ id, quantity }) => {
          const product = await tc.product.findFirst({
            where: { id }
          })

          if (!product) throw new Error('Product not found')

          return {
            price: product.price,
            productId: id,
            quantity
          } as Prisma.ProductSaleCreateManyReceiptInput
        })
      )
      chargedProductData = [...chargedProductData, ...data]
    }

    // Preparamos los datos de los cargos a crear/subir con el recibo :D
    const chargesData: Prisma.ChargeCreateManyReceiptInput[] = body.charges.map((charge) => {
      const { amount, paymentMethod, currencyId } = charge
      const { id, metaPayment } = paymentMethod
      return {
        amount,
        currencyId,
        paymentMethodId: id,
        metaPayment
      } as Prisma.ChargeCreateManyReceiptInput
    })
    const charges: Prisma.ChargeCreateNestedManyWithoutReceiptInput = {
      create: chargesData
    }

    const chargedProducts = {
      createMany: { data: chargedProductData }
    }
    // Preparamos el cuerpo para crear el recibo
    const receiptInput: Prisma.ReceiptCreateArgs = {
      data: {
        amount: body.amount,
        chargedProducts,
        personId: body.person,
        charges
      },
      ...receiptWithAll
    }
    return await tc.receipt.create(receiptInput)
  })) as Receipt
  // Creamos el recibo
  if (!result) throw new Error(`Something is wrong`)

  return result
}
