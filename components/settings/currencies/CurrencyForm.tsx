import { FormControl, FormErrorMessage, FormLabel, Input, SimpleGrid } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { currencyCreateSchema } from 'schema/currencySchema'
import { z } from 'zod'

export const CurrencyForm = ({ onSubmit, defaultValues, ...props }: CurrencyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver: zodResolver(currencyCreateSchema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <SimpleGrid columns={2} gap={4}>
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input {...register('name')} placeholder="Dólar" />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.symbol} isRequired>
          <FormLabel>Símbolo</FormLabel>
          <Input {...register('symbol')} placeholder="$" />
          <FormErrorMessage>{errors.symbol?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </form>
  )
}

type FormInput = z.infer<typeof currencyCreateSchema>

export type CurrencyFormSubmitHandler = SubmitHandler<FormInput>

interface CurrencyFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: CurrencyFormSubmitHandler
  defaultValues?: FormInput
}
