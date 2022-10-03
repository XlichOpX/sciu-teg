import { PaymentMethodInput } from 'types/paymentMethod'
import { fetch } from 'lib/fetch'

export async function updatePaymentMethod(id: number, data: PaymentMethodInput) {
  await fetch(`/api/paymentMethod/${id}`, {
    method: 'PUT',
    body: data
  })
}

export async function createPaymentMethod(data: PaymentMethodInput) {
  return await fetch('/api/paymentMethod', { method: 'POST', body: data })
}

export async function deletePaymentMethod(id: number) {
  return await fetch(`/api/paymentMethod/${id}`, { method: 'DELETE' })
}
