import { Prisma } from '@prisma/client'
import { userEssencials } from 'prisma/queries'

export type UserEssencials = Prisma.UserGetPayload<typeof userEssencials>
