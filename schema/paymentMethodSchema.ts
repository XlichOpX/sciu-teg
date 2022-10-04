import { z } from 'zod'

export const paymentMethodSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  currencyId: z.number().int().positive()
})
