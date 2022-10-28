import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { createCareerSchema } from 'schema/careerSchema'
import { z } from 'zod'

export const CareerForm = ({ onSubmit, defaultValues, ...props }: CareerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver: zodResolver(createCareerSchema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <FormControl isInvalid={!!errors.career} isRequired>
        <FormLabel>Carrera</FormLabel>
        <Input {...register('career')} placeholder="Informática" />
        <FormErrorMessage>{errors.career?.message}</FormErrorMessage>
      </FormControl>
    </form>
  )
}

type FormInput = z.infer<typeof createCareerSchema>

export type CareerFormSubmitHandler = SubmitHandler<FormInput>

interface CareerFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: CareerFormSubmitHandler
  defaultValues?: FormInput
}
