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
import { semesterUpdateSchema } from 'schema/semesterSchema'
import { z } from 'zod'

export const SemesterForm = ({ onSubmit, defaultValues, ...props }: SemesterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormInput>({ resolver: zodResolver(semesterUpdateSchema), defaultValues })

  const [startDate, endDate] = watch(['startDate', 'endDate'])

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <Stack gap={3}>
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

type FormInput = z.infer<typeof semesterUpdateSchema>

export type SemesterFormSubmitHandler = SubmitHandler<FormInput>

interface SemesterFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit: SemesterFormSubmitHandler
  defaultValues?: FormInput
}
