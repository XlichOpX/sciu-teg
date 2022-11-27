export type PaymentMethodReport = {
  amount: number
  paymentMethod: string
  id: number
  currency: { id: number; name: string; symbol: string }
  createdAt: Date
}
export type GroupedPaymentMethodReport = Record<string, PaymentMethodReport[]>

export type CategoryReport = {
  amount: number
  category: string
  id: number
  currency: { id: number; name: string; symbol: string }
}

export type GroupedCategoryReport = Record<string, CategoryReport[]>

export type Report = GroupedPaymentMethodReport | GroupedCategoryReport | ProductReport[]

export type ProductReport = {
  id: number
  name: string
  category: Pick<Category, 'id' | 'name'>
  amount: number
  createdAt: Date
  quantity: number
}
