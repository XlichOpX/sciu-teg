import { Career } from '@prisma/client'
import { createCareerSchema } from 'schema/careerSchema'
import { z } from 'zod'

export type Career = Career
export type CreateCareerInput = z.infer<typeof createCareerSchema>
export type UpdateCareerInput = CreateCareerInput
