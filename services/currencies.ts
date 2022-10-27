import { fetch } from 'lib/fetch'
import { CreateCurrencyInput, UpdateCurrencyInput } from 'types/currency'

export async function updateCurrency(id: number, data: UpdateCurrencyInput) {
  await fetch(`/api/currency/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createCurrency(data: CreateCurrencyInput) {
  return await fetch('/api/currency', { method: 'POST', body: data })
}

export async function deleteCurrency(id: number) {
  return await fetch(`/api/currency/${id}`, { method: 'DELETE' })
}
