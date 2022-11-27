import { fetch } from 'lib/fetch'
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
  return await fetch(`/api/paymentMethod/${id}`, { method: 'DELETE' })
}
