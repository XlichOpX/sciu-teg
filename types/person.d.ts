import { Prisma } from '@prisma/client'
import { personListing, personWithAllData } from 'prisma/queries'
import { APIListing } from './utils'

export type PersonWithAll = Prisma.PersonGetPayload<typeof personWithAllData>
export type PersonGetResponse = APIListing<PersonListing>
export type PersonListing = Prisma.PersonGetPayload<typeof personListing>
