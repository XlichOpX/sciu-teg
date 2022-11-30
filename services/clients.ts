import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
import { ClientGetResponse, ClientWithPersonAndOccupation, CreateClientInput } from 'types/client'
import { PersonGetResponse } from 'types/person'

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

export const getClient = async (docNum: string) => {
  const person = ((await fetch(`/api/person?keyword=${docNum}`)) as PersonGetResponse).result[0]

  if (!person) {
    throw new HttpError({ statusCode: 404, message: 'Cliente no encontrado' })
  }

  if (person.student) {
    throw new HttpError({ statusCode: 409, message: 'Esta persona es un estudiante' })
  }

  if (person.client) {
    try {
      const client = ((await fetch(`/api/client?keyword=${docNum}`)) as ClientGetResponse).result[0]
      return client
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 403) {
          error.message = 'No tiene permiso para acceder a los clientes'
          throw error
        }
      }
    }
  }

  throw new HttpError({ statusCode: 400, message: 'Esta persona es un usuario del sistema' })
}
