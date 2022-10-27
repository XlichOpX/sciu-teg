import { fetch } from 'lib/fetch'
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
  return await fetch(`/api/docType/${id}`, { method: 'DELETE' })
}
