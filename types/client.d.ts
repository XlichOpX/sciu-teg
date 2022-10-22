import { Prisma } from '@prisma/client'
import { clientWithPersonAndOccupation } from 'prisma/queries'

export type ClientWithPersonAndOccupation = Prisma.ClientGetPayload<
  typeof clientWithPersonAndOccupation
>
