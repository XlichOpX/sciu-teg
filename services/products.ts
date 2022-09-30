import { ProductInput } from 'types/product'
import { fetch } from 'lib/fetch'

export async function updateProduct(id: number, data: ProductInput) {
  await fetch(`/api/product/${id}`, {
    method: 'PUT',
    body: data
  })
}
