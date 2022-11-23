import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { ClientWithPersonAndOccupation, CreateClientInput } from 'types/client'

const parseCreateInput = (data: CreateClientInput) => {
  const { occupationId, docTypeId, address, ...person } = data
  return Prisma.validator<Prisma.ClientCreateInput>()({
    person: {
      create: {
        ...person,
        docType: { connect: { id: docTypeId } },
        address: { connect: { id: address } }
      }
    },
    occupation: { connect: { id: occupationId } }
  })
}

export const createClient = async (data: CreateClientInput) => {
  return (await fetch('/api/client', {
    method: 'POST',
    body: parseCreateInput(data)
  })) as ClientWithPersonAndOccupation
}
