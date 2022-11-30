import { z } from 'zod'

export const userStatusCreateSchema = z.object({
  status: z.string().min(1).max(30),
  description: z.string().min(1).max(64)
})

export const userStatusUpdateSchema = userStatusCreateSchema.partial()
