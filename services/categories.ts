import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
import { CategoryInput } from 'types/category'

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
  try {
    return await fetch(`/api/category/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (!(error instanceof HttpError)) throw error

    if (error.statusCode === 409) {
      error.message = 'La categoría se encuentra en uso'
    }

    throw error
  }
}
