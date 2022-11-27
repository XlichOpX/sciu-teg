import { Alert, FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react'
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
  const { selectOptions, error } = usePermissions()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(validationSchema), defaultValues })

  if (error?.statusCode === 403)
    return <Alert status="error">No tiene permiso para leer permisos</Alert>

  return (
    <VStack
      id={id}
      as="form"
      align="stretch"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      gap={3}
    >
      <FormControl isInvalid={!!errors.name} isRequired>
        <FormLabel>Nombre del rol</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} isRequired>
        <FormLabel>Descripción</FormLabel>
        <Input {...register('description')} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Controller
        control={control}
        name="permissions"
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error} isRequired>
            <FormLabel>Permisos</FormLabel>
            <Select
              {...field}
              isMulti
              options={selectOptions}
              placeholder="Permisos"
              closeMenuOnSelect={false}
              noOptionsMessage={() => 'Sin resultados'}
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
  permissions: z.array(
    z.object({
      value: z.number().int().positive(),
      label: z.string().min(1)
    })
  )
})

type FormValues = z.infer<typeof validationSchema>
export type RoleFormSubmitHandler = SubmitHandler<FormValues>
