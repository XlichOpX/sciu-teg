import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { PaymentMethodWithConversion } from 'types/paymentMethod'

export const usePaymentMethods = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<PaymentMethodWithConversion[], Error>('/api/paymentMethod')

  const paymentMethods = useMemo(
    () => data?.filter((pm) => pm.name.toLowerCase().includes(search)),
    [data, search]
  )

  return {
    paymentMethods,
    error,
    isLoading: !data && !error,
    setSearch
  }
}

export const paymentMethodKeysMatcher = '^/api/paymentMethod*'
