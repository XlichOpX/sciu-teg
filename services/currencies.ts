import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
import { CreateCurrencyInput, Currency, UpdateCurrencyInput } from 'types/currency'

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
  try {
    return await fetch(`/api/currency/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (!(error instanceof HttpError)) throw error

    if (error.statusCode === 409) {
      error.message = 'La moneda se encuentra en uso.'
    }

    throw error
  }
}

export async function getCurrencies() {
  return (await fetch('/api/currency')) as Currency[]
}
