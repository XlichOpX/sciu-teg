import { FormControl, FormErrorMessage, FormLabel, Input, Select, VStack } from '@chakra-ui/react'
import useCurrencies from 'hooks/useCurrencies'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { PaymentMethodInput } from 'types/paymentMethod'

const PaymentMethodForm = ({
  id,
  onSubmit,
  formHook,
  resetOnSubmit = true
}: {
  id: string
  onSubmit: SubmitHandler<PaymentMethodInput>
  formHook: UseFormReturn<PaymentMethodInput>
  resetOnSubmit?: boolean
}) => {
  const { currencies } = useCurrencies()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = formHook

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data)
        resetOnSubmit && reset()
      })}
      id={id}
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Nombre</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Input {...register('description')} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.currencyId}>
        <FormLabel>Moneda</FormLabel>
        <Select {...register('currencyId', { valueAsNumber: true })}>
          {currencies?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.symbol}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.currencyId?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default PaymentMethodForm
