import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { ClientGetResponse, ClientWithPersonAndOccupation, CreateClientInput } from 'types/client'

const MATRICULADO = 1

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

export const getClient = async (clientId: string) => {
  return (await fetch(`/api/client/${clientId}`)) as ClientWithPersonAndOccupation
}

export const getClients = async ({ keyword }: { keyword: string }) => {
  return (await fetch(`/api/client?keyword=${keyword}`)) as ClientGetResponse
}
