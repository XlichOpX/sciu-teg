export type PaymentMethodReport = {
  amount: number
  paymentMethod: string
  id: number
  currency: { id: number; name: string; symbol: string }
  createdAt: Date
}

export type CategoryReport = {
  amount: number
  category: string
  id: number
  currency: { id: number; name: string; symbol: string }
}
