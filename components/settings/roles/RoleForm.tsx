import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select } from 'chakra-react-select'
import { usePermissions } from 'hooks'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export const RoleForm = ({
  id,
  onSubmit,
  defaultValues
}: {
  id: string
  onSubmit: RoleFormSubmitHandler
  defaultValues?: FormValues
}) => {
  const { selectOptions } = usePermissions()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(validationSchema), defaultValues })

  return (
    <VStack id={id} as="form" align="stretch" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid columns={[1, 2]} gap={4}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Nombre del rol</FormLabel>
          <Input {...register('name')} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.level}>
          <FormLabel>Nivel</FormLabel>
          <Input type="number" {...register('level', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.level?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Descripción</FormLabel>
        <Input {...register('description')} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Controller
        control={control}
        name="permissions"
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <FormLabel>Permisos</FormLabel>
            <Select
              {...field}
              isMulti
              options={selectOptions}
              placeholder="Permisos"
              closeMenuOnSelect={false}
            />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    </VStack>
  )
}

const validationSchema = z.object({
  name: z.string().min(1).max(30),
  description: z.string().min(1).max(64),
  level: z.number().int().nonnegative(),
  permissions: z.array(
    z.object({
      value: z.number().int().positive(),
      label: z.string().min(1)
    })
  )
})

type FormValues = z.infer<typeof validationSchema>
export type RoleFormSubmitHandler = SubmitHandler<FormValues>
