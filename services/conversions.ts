import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
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
  try {
    return await fetch(`/api/conversion/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 409) {
      error.message === 'La tasa de cambio se encuentra en uso'
    }
    throw error
  }
}

export const getLatestConversions = async () => {
  return (await fetch('/api/conversion/latest')) as ConversionWithCurrency[]
}
