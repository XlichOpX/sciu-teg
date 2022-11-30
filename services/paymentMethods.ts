import { fetch } from 'lib/fetch'
import { HttpError } from 'lib/http-error'
import { PaymentMethodCreateInput } from 'types/paymentMethod'

export async function updatePaymentMethod(id: number, data: PaymentMethodCreateInput) {
  await fetch(`/api/paymentMethod/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createPaymentMethod(data: PaymentMethodCreateInput) {
  return await fetch('/api/paymentMethod', { method: 'POST', body: data })
}

export async function deletePaymentMethod(id: number) {
  try {
    return await fetch(`/api/paymentMethod/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 409) {
      error.message = 'El método de pago se encuentra en uso'
    }
    throw error
  }
}
