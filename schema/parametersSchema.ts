import { z } from 'zod'

export const parametersSchema = z.object({
  institute: z.string().min(1).max(128),
  rif: z.string().min(1).max(28),
  phone: z.string().min(1).max(32),
  population: z.string().min(1).max(64),
  address: z.string().min(1).max(128)
})
