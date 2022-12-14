import { HttpError } from 'lib/http-error'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { PaymentMethodWithCurrencies } from 'types/paymentMethod'

export const usePaymentMethods = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<PaymentMethodWithCurrencies[], HttpError>('/api/paymentMethod')

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
