import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { createDoctypeSchema } from 'schema/doctypeSchema'
import { z } from 'zod'

export const DoctypeForm = ({ onSubmit, defaultValues, ...props }: DoctypeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver: zodResolver(createDoctypeSchema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <FormControl isInvalid={!!errors.type} isRequired>
        <FormLabel>Tipo de documento</FormLabel>
        <Input {...register('type')} placeholder="PP" />
        <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
      </FormControl>
    </form>
  )
}

type FormInput = z.infer<typeof createDoctypeSchema>

export type DoctypeFormSubmitHandler = SubmitHandler<FormInput>

interface DoctypeFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: DoctypeFormSubmitHandler
  defaultValues?: FormInput
}
