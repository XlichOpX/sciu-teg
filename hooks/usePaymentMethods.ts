import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { createPaymentMethod as createPaymentMethodSv } from 'services/paymentMethods'
import useSWR from 'swr'
import { PaymentMethodInput, PaymentMethodWithConversion } from 'types/paymentMethod'

export const usePaymentMethods = () => {
  const [search, setSearch] = useState('')
  const { data, error, mutate } = useSWR<PaymentMethodWithConversion[], Error>('/api/paymentMethod')
  const toast = useToast()

  const createPaymentMethod = async (data: PaymentMethodInput) => {
    try {
      await createPaymentMethodSv(data)
      await mutate()
      toast({ status: 'success', description: 'Método de pago creado' })
    } catch (error) {
      toast({ status: 'error', description: 'Ocurrió un error al crear el método de pago' })
    }
  }

  return {
    paymentMethods: data?.filter((pm) => pm.name.toLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    setSearch,
    createPaymentMethod
  }
}

export const paymentMethodKeysMatcher = '^/api/paymentMethod*'
