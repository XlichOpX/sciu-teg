import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { ConversionWithCurrency, CreateConversionInput } from 'types/conversion'

export async function updateConversion(id: number, data: Prisma.ConversionUpdateInput) {
  await fetch(`/api/conversion/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createConversion(data: CreateConversionInput) {
  return await fetch('/api/conversion', { method: 'POST', body: data })
}

export async function deleteConversion(id: number) {
  return await fetch(`/api/conversion/${id}`, { method: 'DELETE' })
}

export const getLatestConversions = async () => {
  return (await fetch('/api/conversion/latest')) as ConversionWithCurrency[]
}
