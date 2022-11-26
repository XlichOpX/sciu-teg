import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { UserCreateInput, UserEssentials, UserUpdateInput } from 'types/user'

/** Toma los datos como vienen del form y los pasa a la forma que necesita prisma */
const parseCreateUserFormData = ({
  username,
  password,
  secret,
  person,
  statusId,
  roles
}: UserCreateInput) => {
  let personData

  if (typeof person === 'number') {
    personData = {
      connect: {
        id: person
      }
    }
  } else {
    const { docTypeId, ...rest } = person
    personData = {
      create: {
        ...rest,
        address: {
          connect: {
            id: person.address
          }
        },
        docType: {
          connect: { id: docTypeId }
        }
      }
    }
  }

  return Prisma.validator<Prisma.UserCreateInput>()({
    username,
    password,
    secret: {
      create: {
        ...secret
      }
    },
    person: personData,
    status: {
      connect: {
        id: statusId
      }
    },
    roles: {
      connect: roles.map((r) => ({ id: r.value }))
    }
  })
}

export const createUser = async (data: UserCreateInput) => {
  return await fetch('/api/user', { method: 'POST', body: parseCreateUserFormData(data) })
}

/** Toma los datos del form de modificar usuario y los pasa al formato que requiere prisma */
const parseUpdateUserFormData = ({ roles }: UserUpdateInput) =>
  Prisma.validator<Prisma.UserUpdateInput>()({
    roles: {
      set: roles.map((r) => ({ id: r }))
    }
  })

export const updateUser = async (userId: number, data: UserUpdateInput) => {
  return (await fetch(`/api/user/${userId}`, {
    method: 'PUT',
    body: parseUpdateUserFormData(data)
  })) as UserEssentials
}

export const deleteUser = async (userId: number) => {
  return await fetch(`/api/user/${userId}`, { method: 'DELETE' })
}

export const getUserById = async (id: number) => await fetch(`/api/user/${id}`)
