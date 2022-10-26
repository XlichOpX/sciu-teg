import { Prisma } from '@prisma/client'
import { userEssencials, userWithAll } from 'prisma/queries'
import { userSchema, userUpdateSchema } from 'schema/userSchema'
import { z } from 'zod'

export type UserEssencials = Prisma.UserGetPayload<typeof userEssencials>

export type UserWithAll = Prisma.UserGetPayload<typeof userWithAll>

export type UserCreateInput = z.infer<typeof userSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
