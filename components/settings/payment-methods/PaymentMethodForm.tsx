import { FormControl, FormErrorMessage, FormLabel, Input, Select, VStack } from '@chakra-ui/react'
import { useCurrencies } from 'hooks'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { PaymentMethodInput } from 'types/paymentMethod'

export const PaymentMethodForm = ({
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
      noValidate
    >
      <FormControl isInvalid={!!errors.name} isRequired>
        <FormLabel>Nombre</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} isRequired>
        <FormLabel>Description</FormLabel>
        <Input {...register('description')} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.currencyId} isRequired>
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
