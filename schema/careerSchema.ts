import { z } from 'zod'

export const createCareerSchema = z.object({
  career: z.string().min(1).max(40)
})

export const careerUpdateSchema = createCareerSchema
