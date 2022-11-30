import { FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { userStatusCreateSchema } from 'schema/userStatusSchema'
import { z } from 'zod'

export const UserStatusForm = ({ onSubmit, defaultValues, ...props }: UserStatusFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver: zodResolver(userStatusCreateSchema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <Stack gap={3}>
        <FormControl isInvalid={!!errors.status} isRequired>
          <FormLabel>Status</FormLabel>
          <Input {...register('status')} />
          <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description} isRequired>
          <FormLabel>Descripción</FormLabel>
          <Input {...register('description')} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
    </form>
  )
}

type FormInput = z.infer<typeof userStatusCreateSchema>

export type UserStatusFormSubmitHandler = SubmitHandler<FormInput>

interface UserStatusFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: UserStatusFormSubmitHandler
  defaultValues?: FormInput
}
