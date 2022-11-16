import { z } from 'zod'

export const conversionCreateSchema = z.object({
  currencyId: z.number().positive().int(),
  value: z.number().positive()
})

export const conversionUpdateSchema = conversionCreateSchema.partial()
