import { z } from 'zod'

export const paymentMethodSchema = z.object({
  name: z.string().min(1).max(26),
  description: z.string().min(1).max(64),
  currencyId: z.number().int().positive()
})
