import { fetch } from 'lib/fetch'
import { CreateCareerInput, UpdateCareerInput } from 'types/career'

export async function updateCareer(id: number, data: UpdateCareerInput) {
  await fetch(`/api/career/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createCareer(data: CreateCareerInput) {
  return await fetch('/api/career', { method: 'POST', body: data })
}

export async function deleteCareer(id: number) {
  return await fetch(`/api/career/${id}`, { method: 'DELETE' })
}
