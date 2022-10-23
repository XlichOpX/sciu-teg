import { Prisma } from '@prisma/client'
import { personListing, personWithAllData } from 'prisma/queries'

export type PersonWithAll = Prisma.PersonGetPayload<typeof personWithAllData>

export type PersonListing = Prisma.PersonGetPayload<typeof personListing>
