import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
import { ClientWithPersonAndOccupation, CreateClientInput } from 'types/client'
import { PersonGetResponse } from 'types/person'
import { StudentWithPersonStatusCareerAndEnrolledSemesters } from 'types/student'

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

export const getClient = async (docNum: string) => {
  const person = ((await fetch(`/api/person?keyword=${docNum}`)) as PersonGetResponse).result[0]

  if (person) {
    if (person.student) {
      const student = (await fetch(
        `/api/student/${person.student.id}`
      )) as StudentWithPersonStatusCareerAndEnrolledSemesters
      //Sí el estudiante no está matriculado (está retirado o graduado) Que actúe como nuevo cliente
      if (student.status.id === MATRICULADO)
        throw new HttpError({ statusCode: 409, message: 'Esta persona es un estudiante' })
      else throw new HttpError({ statusCode: 404, message: 'Cliente no encontrado' })
    }

    if (person.client) {
      try {
        const client = (await fetch(
          `/api/client/${person.client.id}`
        )) as ClientWithPersonAndOccupation
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
  }

  //Sí es un usuario, que importa? igual le podemos cobrar como cliente :D
  throw new HttpError({ statusCode: 404, message: 'Cliente no encontrado' })
}
