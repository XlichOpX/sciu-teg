import { ProductInput } from 'types/product'
import { fetch } from 'lib/fetch'

export async function updateProduct(id: number, data: ProductInput) {
  await fetch(`/api/product/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createProduct(data: ProductInput) {
  return await fetch('/api/product', { method: 'POST', body: data })
}

export async function deleteProduct(id: number) {
  return await fetch(`/api/product/${id}`, { method: 'DELETE' })
}
