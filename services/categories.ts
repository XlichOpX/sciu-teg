import { CategoryInput } from 'types/category'
import { fetch } from 'lib/fetch'

export async function updateCategory(id: number, data: CategoryInput) {
  await fetch(`/api/category/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createCategory(data: CategoryInput) {
  return await fetch('/api/category', { method: 'POST', body: data })
}

export async function deleteCategory(id: number) {
  return await fetch(`/api/category/${id}`, { method: 'DELETE' })
}
