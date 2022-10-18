import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'

export async function updateConversion(id: number, data: Prisma.ConversionUpdateInput) {
  await fetch(`/api/conversion/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createConversion(data: Prisma.ConversionCreateInput) {
  return await fetch('/api/conversion', { method: 'POST', body: data })
}

export async function deleteConversion(id: number) {
  return await fetch(`/api/conversion/${id}`, { method: 'DELETE' })
}
