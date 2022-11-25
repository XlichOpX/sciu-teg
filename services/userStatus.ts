import { Prisma, UserStatus } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { CreateUserStatusInput, UpdateUserStatusInput } from 'types/userStatus'

export const getUserStatus = async () => {
  return (await fetch('/api/userStatus')) as UserStatus[]
}

export async function updateUserStatus(id: number, data: UpdateUserStatusInput) {
  const body: Prisma.UserStatusUpdateInput = {
    ...data
  }

  await fetch(`/api/userStatus/${id}`, {
    method: 'PUT',
    body
  })
}

export async function createUserStatus(data: CreateUserStatusInput) {
  const body: Prisma.UserStatusCreateInput = {
    ...data
  }

  return await fetch('/api/userStatus', { method: 'POST', body })
}

export async function deleteUserStatus(id: number) {
  return await fetch(`/api/userStatus/${id}`, { method: 'DELETE' })
}
