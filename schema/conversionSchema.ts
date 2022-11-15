import { z } from 'zod'

export const createConversionSchema = z.object({
  currencyId: z.number().positive().int(),
  value: z.number().positive()
})
