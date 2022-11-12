import { z } from 'zod'
import { metaPaymentDataSchema } from './paymentMethodSchema'

// Schema from validate create Receipt.
/**
body: {
  amount: number
  billings: number
  charges: {
    amount: number
    paymentMethod: {
      id: number
      metaPayment:{
        name: string
        value: string
        fieldType: string | date
      }
      conversion: number
    }
  }
  products: {
    id: number
    quantity: number
  }
  person: number
}
 **/
export const receiptProductSchema = z.object({
  id: z.number().positive().int(),
  quantity: z.number().positive().int()
})

export const receiptCreateSchemaInput = z.object({
  amount: z.number().positive(),
  billings: z.number().positive().int().array().nullish(),
  charges: z
    .object({
      amount: z.number({ invalid_type_error: 'Monto requerido' }).positive(),
      paymentMethod: z.object({
        id: z.number().positive(),
        metaPayment: metaPaymentDataSchema.array().nullish(),
        conversion: z.number().positive()
      })
    })
    .array(),
  products: receiptProductSchema.array().nullish(),
  person: z.number().positive().int()
})
