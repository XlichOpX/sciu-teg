import { z } from 'zod'

const metaPaymentTypeSchema = z.union([z.literal('string'), z.literal('date')])

const metaPaymentDefSchema = z.object({
  name: z.string().min(1).max(32),
  fieldType: metaPaymentTypeSchema
})

export const metaPaymentDataSchema = z.object({
  name: z.string().min(1).max(32),
  value: z.string().min(1, 'Requerido').max(32),
  fieldType: metaPaymentTypeSchema
})

export const paymentMethodCreateSchema = z.object({
  name: z.string().min(1).max(26),
  description: z.string().min(1).max(64),
  currencies: z
    .object({
      id: z.number().int().positive()
    })
    .array(),
  metaPayment: metaPaymentDefSchema.array()
})

export const paymentMethodUpdateSchema = paymentMethodCreateSchema.partial()
