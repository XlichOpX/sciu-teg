import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { UserCreateInput, UserEssentials, UserUpdateInput } from 'types/user'

export const createUser = async (data: UserCreateInput) => {
  return await fetch('/api/user', { method: 'POST', body: data })
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
