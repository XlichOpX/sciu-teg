import { z } from 'zod'
import { castEmptyString } from './utils'

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
  address: z.number().positive().int(),
  cellphone: castEmptyString(z.string().min(1).max(24).optional()),
  docNumber: z.string().min(1).max(12),
  docTypeId: z.number().positive().int(),
  email: z.string().email(),
  firstLastName: z.string().min(1).max(20),
  firstName: z.string().min(1).max(20),
  landline: z.string().min(1).max(24),
  middleName: castEmptyString(z.string().max(20).optional()),
  secondLastName: castEmptyString(z.string().max(20).optional())
})

/**
 * Schema to validate user create input
 */
export const userSchema = z.object({
  password: z.string().min(8).max(32),
  person: personSchema.or(z.number().positive().int()),
  roles: z.object({ label: z.string(), value: z.number().int().positive() }).array().min(1),
  secret: secretSchema,
  statusId: z.number().positive().int(),
  username: z.string().min(1).max(32)
})

export const userUpdateSchema = z.object({
  roles: z.number().int().positive().array().min(1),
  statusId: userSchema.shape.statusId
})
