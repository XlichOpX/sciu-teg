import { FormControl, FormErrorMessage, FormLabel, Input, SimpleGrid } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const validationSchema = z.object({
  dolar: z.number().positive(),
  euro: z.number().positive()
})

export const ConversionForm = ({ onSubmit, defaultValues, ...props }: ConversionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver: zodResolver(validationSchema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <SimpleGrid columns={2} gap={4}>
        <FormControl isInvalid={!!errors.dolar} isRequired>
          <FormLabel>Dólar</FormLabel>
          <Input
            type="number"
            {...register('dolar', { valueAsNumber: true })}
            placeholder="Precio del dólar"
          />
          <FormErrorMessage>{errors.dolar?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.euro} isRequired>
          <FormLabel>Euro</FormLabel>
          <Input
            type="number"
            {...register('euro', { valueAsNumber: true })}
            placeholder="Precio del euro"
          />
          <FormErrorMessage>{errors.euro?.message}</FormErrorMessage>
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
