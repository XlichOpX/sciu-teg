import { z } from 'zod'

export const metaPaymentSchema = z
  .object({ name: z.string(), fieldType: z.union([z.literal('string'), z.literal('date')]) })
  .array()

export const paymentMethodInputSchema = z.object({
  name: z.string().min(1).max(26),
  description: z.string().min(1).max(64),
  currencyId: z.number().int().positive(),
  metaPayment: metaPaymentSchema
})
