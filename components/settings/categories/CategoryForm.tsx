import { FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { CategoryInput } from 'types/category'

interface Props {
  id: string
  onSubmit: SubmitHandler<CategoryInput>
  formHook: UseFormReturn<CategoryInput>
  resetOnSubmit?: boolean
}

export const CategoryForm = ({ id, onSubmit, formHook, resetOnSubmit = false }: Props) => {
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
        <Input {...register('name')} placeholder="Aranceles - Egresados" />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} isRequired>
        <FormLabel>Description</FormLabel>
        <Input
          {...register('description')}
          placeholder="Aranceles destinados a los estudiantes egresados"
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}
