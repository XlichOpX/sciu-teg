import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
import { CreateDoctypeInput, UpdateDoctypeInput } from 'types/doctype'

export async function updateDoctype(id: number, data: UpdateDoctypeInput) {
  await fetch(`/api/docType/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createDoctype(data: CreateDoctypeInput) {
  return await fetch('/api/docType', { method: 'POST', body: data })
}

export async function deleteDoctype(id: number) {
  try {
    return await fetch(`/api/docType/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 409) {
      error.message = 'El tipo de documento se encuentra en uso'
    }
    throw error
  }
}
