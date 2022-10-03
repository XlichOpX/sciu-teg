import { PaymentMethod } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'

function usePaymentMethods() {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<PaymentMethod[], Error>('/api/paymentMethod')
  return {
    paymentMethods: data?.filter((pm) => pm.name.toLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    setSearch
  }
}

export default usePaymentMethods
