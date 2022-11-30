import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'

export async function updateRole(id: number, data: Prisma.RoleUpdateInput) {
  await fetch(`/api/role/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createRole(data: Prisma.RoleCreateInput) {
  return await fetch('/api/role', { method: 'POST', body: data })
}

export async function deleteRole(id: number) {
  try {
    return await fetch(`/api/role/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 409) {
      error.message = 'El rol se encuentra en uso'
    }
    throw error
  }
}
