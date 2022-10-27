import { z } from 'zod'

export const createCurrencySchema = z.object({
  name: z.string().min(1).max(32),
  symbol: z.string().min(1).max(4)
})

export const currencyUpdateSchema = createCurrencySchema
