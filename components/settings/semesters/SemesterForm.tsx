import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentPropsWithoutRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { semesterCreateSchema } from 'schema/semesterSchema'
import { z } from 'zod'

export const SemesterForm = ({ onSubmit, defaultValues, ...props }: SemesterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormInput>({ resolver: zodResolver(semesterCreateSchema), defaultValues })

  const [startDate, endDate] = watch(['startDate', 'endDate'])

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <Stack gap={3}>
        <FormControl isInvalid={!!errors.semester} isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input {...register('semester')} />
          <FormErrorMessage>{errors.semester?.message}</FormErrorMessage>
        </FormControl>

        <SimpleGrid columns={2} gap={4}>
          <FormControl isInvalid={!!errors.startDate} isRequired>
            <FormLabel>Fecha de inicio</FormLabel>
            <Input max={endDate} type="date" {...register('startDate')} />
            <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.endDate} isRequired>
            <FormLabel>Fecha de fin</FormLabel>
            <Input min={startDate} type="date" {...register('endDate')} />
            <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Stack>
    </form>
  )
}

type FormInput = z.infer<typeof semesterCreateSchema>

export type SemesterFormSubmitHandler = SubmitHandler<FormInput>

interface SemesterFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: SemesterFormSubmitHandler
  defaultValues?: FormInput
}
