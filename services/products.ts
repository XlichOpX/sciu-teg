import { fetch } from 'lib/fetch'
import { CategoryWithProducts } from 'types/category'
import { ProductInput } from 'types/product'

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

export async function getProductsByCategory(categoryId: number) {
  return (await fetch(`/api/category/${categoryId}/products`)) as CategoryWithProducts
}
