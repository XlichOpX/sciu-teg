import { z } from 'zod'

export const metaPaymentTypeSchema = z.union([z.literal('string'), z.literal('date')])

export const metaPaymentDefSchema = z.object({
  name: z.string().min(1).max(32),
  fieldType: metaPaymentTypeSchema
})

export const metaPaymentDataSchema = z.object({
  name: z.string().min(1).max(32),
  value: z.string().min(1, 'Requerido').max(32),
  fieldType: metaPaymentTypeSchema
})

export const paymentMethodInputSchema = z.object({
  name: z.string().min(1).max(26),
  description: z.string().min(1).max(64),
  currencyId: z.number().int().positive(),
  metaPayment: metaPaymentDefSchema.array().nullish()
})
