import { Prisma } from '@prisma/client'
import { clientWithPersonAndOccupation } from 'prisma/queries'
import { createClientSchema } from 'schema/clientSchema'
import { z } from 'zod'
import { APIListing } from './utils'

export type ClientWithPersonAndOccupation = Prisma.ClientGetPayload<
  typeof clientWithPersonAndOccupation
>
export type CreateClientInput = z.infer<typeof createClientSchema>
export type ClientGetResponse = APIListing<ClientWithPersonAndOccupation>
