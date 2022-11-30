import { Prisma } from '@prisma/client'
import { userEssentials, userWithAll } from 'prisma/queries'
import { userSchema, userUpdateSchema } from 'schema/userSchema'
import { z } from 'zod'

export type UserEssentials = Prisma.UserGetPayload<typeof userEssentials>

export type UserWithAll = Prisma.UserGetPayload<typeof userWithAll>

export type UserCreateInput = z.infer<typeof userSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
