import { Parameters } from '@prisma/client'
import { fetch } from 'lib/fetch'

export async function updateParameters(id: number, data: Parameters) {
  await fetch(`/api/parameters/${id}`, {
    method: 'PUT',
    body: data
  })
}
