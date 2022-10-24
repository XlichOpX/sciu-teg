import { Prisma } from '@prisma/client'
import { userEssencials, userWithAll } from 'prisma/queries'

export type UserEssencials = Prisma.UserGetPayload<typeof userEssencials>

export type UserWithAll = Prisma.UserGetPayload<typeof userWithAll>
