import { PaymentMethod } from '@prisma/client'
import useSWR from 'swr'

function usePaymentMethods() {
  const { data, error } = useSWR<PaymentMethod[], Error>('/api/paymentMethod')
  return { paymentMethods: data, error, isLoading: !data && !error }
}

export default usePaymentMethods
