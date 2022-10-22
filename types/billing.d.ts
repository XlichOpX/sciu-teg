import { Prisma } from '@prisma/client'
import { billing } from 'prisma/queries'

export type BillingComparatorArgs = Prisma.BillingGetPayload<typeof billing>
