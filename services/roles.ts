import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'

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
  return await fetch(`/api/role/${id}`, { method: 'DELETE' })
}
