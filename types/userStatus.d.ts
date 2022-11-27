import { UserStatus } from '@prisma/client'
import { userStatusCreateSchema, userStatusUpdateSchema } from 'schema/userStatusSchema'
import { z } from 'zod'

export type UserStatus = UserStatus
export type CreateUserStatusInput = z.infer<typeof userStatusCreateSchema>
export type UpdateUserStatusInput = z.infer<typeof userStatusUpdateSchema>
