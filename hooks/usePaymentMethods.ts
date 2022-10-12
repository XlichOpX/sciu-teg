import { useToast } from '@chakra-ui/react'
import { PaymentMethod } from '@prisma/client'
import { useState } from 'react'
import {
  createPaymentMethod as createPaymentMethodSv,
  deletePaymentMethod as deletePaymentMethodSv,
  updatePaymentMethod as updatePaymentMethodSv
} from 'services/paymentMethods'
import useSWR from 'swr'
import { PaymentMethodInput } from 'types/paymentMethod'

export const usePaymentMethods = () => {
  const [search, setSearch] = useState('')
  const { data, error, mutate } = useSWR<PaymentMethod[], Error>('/api/paymentMethod')
  const toast = useToast()

  const createPaymentMethod = async (data: PaymentMethodInput) => {
    await createPaymentMethodSv(data)
    await mutate()
    toast({ status: 'success', description: 'Método de pago creado' })
  }

  const updatePaymentMethod = async (id: number, data: PaymentMethodInput) => {
    await updatePaymentMethodSv(id, data)
    await mutate()
    toast({ status: 'success', description: 'Método de pago actualizado' })
  }

  const deletePaymentMethod = async (id: number) => {
    try {
      await deletePaymentMethodSv(id)
      await mutate()
      toast({ status: 'success', description: 'Método de pago eliminado' })
    } catch {
      toast({ status: 'error', description: 'No se pudo eliminar el método de pago' })
    }
  }

  return {
    paymentMethods: data?.filter((pm) => pm.name.toLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    setSearch,
    updatePaymentMethod,
    deletePaymentMethod,
    createPaymentMethod
  }
}
