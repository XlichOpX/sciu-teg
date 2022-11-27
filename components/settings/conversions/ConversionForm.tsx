import {
  Alert,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FullyCenteredSpinner } from 'components/app'
import { useCurrencies } from 'hooks'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const validationSchema = z.object({
  currencyId: z.number().positive().int(),
  value: z.number().positive()
})

export const ConversionForm = ({ onSubmit, defaultValues, ...props }: ConversionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver: zodResolver(validationSchema), defaultValues })

  const { currencies, error } = useCurrencies()

  if (error?.statusCode === 403) return <Alert>No tiene permiso para leer monedas</Alert>
  if (!currencies) return <FullyCenteredSpinner />

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <SimpleGrid columns={2} gap={4}>
        <FormControl isInvalid={!!errors.currencyId} isRequired>
          <FormLabel>Moneda</FormLabel>
          <Select {...register('currencyId', { valueAsNumber: true })}>
            {currencies.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name} - {c.symbol}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.currencyId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.value} isRequired>
          <FormLabel>Valor</FormLabel>
          <Input
            type="number"
            {...register('value', { valueAsNumber: true })}
            placeholder="Valor por $1"
          />
          <FormErrorMessage>{errors.value?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </form>
  )
}

type FormInput = z.infer<typeof validationSchema>
export type ConversionFormSubmitHandler = SubmitHandler<FormInput>
interface ConversionFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: ConversionFormSubmitHandler
  defaultValues?: FormInput
}
