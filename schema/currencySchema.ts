import { z } from 'zod'

export const currencyCreateSchema = z.object({
  name: z.string().min(1).max(32),
  symbol: z.string().min(1).max(4)
})

export const currencyUpdateSchema = currencyCreateSchema.partial()
