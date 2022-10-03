import { PaymentMethod } from '@prisma/client'
import { useState } from 'react'
import { updatePaymentMethod } from 'services/paymentMethods'
import useSWR from 'swr'
import { PaymentMethodInput } from 'types/paymentMethod'

function usePaymentMethods() {
  const [search, setSearch] = useState('')
  const { data, error, mutate } = useSWR<PaymentMethod[], Error>('/api/paymentMethod')

  const mutatePaymentMethod = async (id: number, data: PaymentMethodInput) => {
    await updatePaymentMethod(id, data)
    await mutate()
  }

  return {
    paymentMethods: data?.filter((pm) => pm.name.toLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    setSearch,
    mutatePaymentMethod
  }
}

export default usePaymentMethods
