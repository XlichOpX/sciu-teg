import { Prisma } from '@prisma/client'
import prisma from 'lib/prisma'
import { CreateReceiptInput } from 'types/receipt'

export const insertReceipt = async (body: CreateReceiptInput) => {
  if (!body.products && !body.billings) {
    /* sí NO hay productos y Sí NO hay facturas, daré error */
    throw new Error(`Bad Request, not billings or products found`)
  }

  // se crea una transacción para generar el recibo. Al mínimo fallo se cancelan los cambios.
  const result = await prisma.$transaction(async (tc) => {
    // declaramos 'Productos cobrados'
    let chargedProductData: Prisma.ProductSaleCreateManyReceiptInput[] = []

    const { billings, amount, charges, person, products } = body

    if (billings) {
      // Si el existen billing, entonces los usaremos para crear los cargos.
      // Generamos un arreglo de chargedProduct y cambiamos el estado 'isCharged' del 'billing' a true. SIN el Id de Receipt.
      const data = await Promise.all(
        billings.map(async (id) => {
          if (!(await tc.billing.findFirst({ where: { id } })))
            throw new Error(`billing ${id} not found`)

          const { amount, productId } = await tc.billing.update({
            data: { isCharged: { set: true } },
            select: { amount: true, productId: true, id: true },
            where: { id }
          })

          return {
            price: amount,
            productId: productId,
            billingId: id
          }
        })
      )

      // Unimos la data al arreglo externo a la validación
      chargedProductData = [...chargedProductData, ...data]
    }

    if (products) {
      // Generamos un arreglo de chargedProduct, buscando la información en la base de datos primero. SIN el Id de Receipt.
      const data = await Promise.all(
        products.map(async ({ id, quantity }) => {
          if (!(await tc.product.findFirst({ where: { id } })))
            throw new Error(`Product id:${id} not found`)

          const { price } = await tc.product.update({
            data: { stock: { decrement: quantity } },
            select: { price: true },
            where: { id }
          })

          return {
            price,
            productId: id,
            quantity
          }
        })
      )
      chargedProductData = [...chargedProductData, ...data]
    }

    //encapsulamos chargedProductData (arreglo) en chargedProducts para la creación de estos al crear el recibo
    const chargedProducts = {
      createMany: { data: chargedProductData }
    }

    // Preparamos el cuerpo para crear el recibo
    const receiptInput: Prisma.ReceiptCreateArgs = {
      data: {
        amount,
        chargedProducts,
        personId: person,
        // Preparamos los datos de los cargos a crear con el recibo
        charges: {
          create: charges.map((charge) => {
            const { amount, paymentMethod, currencyId } = charge
            const { id, metaPayment } = paymentMethod
            return {
              amount,
              currencyId,
              paymentMethodId: id,
              metaPayment
            } as Prisma.ChargeCreateManyReceiptInput
          })
        }
      }
    }
    return await tc.receipt.create(receiptInput)
  })

  if (!result) throw new Error(`Something is wrong`)
  return result
}
