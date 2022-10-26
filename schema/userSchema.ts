import { z } from 'zod'

/**
 * Schema to validate secret create input
 */
export const secretSchema = z.object({
  questionOne: z.string().min(1).max(128),
  answerOne: z.string().min(1).max(128),
  questionTwo: z.string().min(1).max(128),
  answerTwo: z.string().min(1).max(128),
  questionThree: z.string().min(1).max(128),
  answerThree: z.string().min(1).max(128)
})

/**
 * Schema to validate person create input
 */
export const personSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().min(1).max(20).optional(),
  firstLastName: z.string().min(1).max(20),
  secondLastName: z.string().min(1).max(20).optional(),
  docNumber: z.string().min(1).max(12),
  docTypeId: z.number().positive().int(),
  address: z.string().min(1).max(120),
  email: z.string().email(),
  landline: z.string().min(1).max(24)
})

/**
 * Schema to validate user create input
 */
export const userSchema = z.object({
  username: z.string().min(1).max(32),
  password: z.string().min(8).max(32),
  secret: secretSchema,
  statusId: z.number().positive().int(),
  person: personSchema.or(z.number().positive().int()),
  roles: z.object({ label: z.string(), value: z.number().int().positive() }).array().min(1)
})

export const userUpdateSchema = z.object({
  roles: z.number().int().positive().array().min(1)
})
