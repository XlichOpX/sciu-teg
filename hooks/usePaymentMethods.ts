import { useToast } from '@chakra-ui/react'
import { PaymentMethod } from '@prisma/client'
import { useState } from 'react'
import {
  updatePaymentMethod,
  deletePaymentMethod as deletePaymentMethodSv
} from 'services/paymentMethods'
import useSWR from 'swr'
import { PaymentMethodInput } from 'types/paymentMethod'

function usePaymentMethods() {
  const [search, setSearch] = useState('')
  const { data, error, mutate } = useSWR<PaymentMethod[], Error>('/api/paymentMethod')
  const toast = useToast()

  const mutatePaymentMethod = async (id: number, data: PaymentMethodInput) => {
    await updatePaymentMethod(id, data)
    await mutate()
  }

  const deletePaymentMethod = async (id: number) => {
    try {
      await deletePaymentMethodSv(id)
      await mutate()
    } catch {
      toast({ status: 'error', description: 'No se pudo eliminar el método de pago' })
    }
  }

  return {
    paymentMethods: data?.filter((pm) => pm.name.toLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    setSearch,
    mutatePaymentMethod,
    deletePaymentMethod
  }
}

export default usePaymentMethods
