import { Prisma } from '@prisma/client'
import { personWithAllData } from 'prisma/queries'

export type PersonWithAll = Prisma.PersonGetPayload<typeof personWithAllData>
