import { z } from 'zod'

export const createDoctypeSchema = z.object({
  type: z.string().min(1).max(4)
})

export const doctypeUpdateSchema = createDoctypeSchema
