import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'
import { Select as RSelect } from 'chakra-react-select'
import { useRoles } from 'hooks'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { userSchema } from 'schema/userSchema'
import { z } from 'zod'

export const userFormSchema = userSchema
  .omit({ person: true, personId: true })
  .merge(z.object({ passwordConfirm: z.string() }))
  .refine((val) => val.password === val.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm']
  })
export type UserFormData = z.infer<typeof userFormSchema>
export type UserFormSubmitHandler = SubmitHandler<UserFormData>

interface UserFormProps {
  onSubmit: SubmitHandler<UserFormData>
  formHook: UseFormReturn<UserFormData>
  id: string
}

export const UserForm = ({ formHook, onSubmit, id }: UserFormProps) => {
  const { selectOptions } = useRoles()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = formHook

  return (
    <Stack
      gap={2}
      as="form"
      onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
      id={id}
    >
      <FormControl isInvalid={!!errors.username} isRequired>
        <FormLabel>Nombre de usuario</FormLabel>
        <Input {...register('username')} />
        <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.password} isRequired>
        <FormLabel>Contraseña</FormLabel>
        <Input type="password" autoComplete="new-password" {...register('password')} />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.passwordConfirm} isRequired>
        <FormLabel>Confirmar contraseña</FormLabel>
        <Input type="password" autoComplete="new-password" {...register('passwordConfirm')} />
        <FormErrorMessage>{errors.passwordConfirm?.message}</FormErrorMessage>
      </FormControl>

      <SimpleGrid columns={[1, 2]} gap={4}>
        <FormControl isInvalid={!!errors.secret?.questionOne} isRequired>
          <FormLabel>Pregunta #1</FormLabel>
          <Input {...register('secret.questionOne')} />
          <FormErrorMessage>{errors.secret?.questionOne?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerOne} isRequired>
          <FormLabel>Respuesta</FormLabel>
          <Input {...register('secret.answerOne')} />
          <FormErrorMessage>{errors.secret?.answerOne?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.questionTwo} isRequired>
          <FormLabel>Pregunta #2</FormLabel>
          <Input {...register('secret.questionTwo')} />
          <FormErrorMessage>{errors.secret?.questionTwo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerTwo} isRequired>
          <FormLabel>Respuesta</FormLabel>
          <Input {...register('secret.answerTwo')} />
          <FormErrorMessage>{errors.secret?.answerTwo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.questionThree} isRequired>
          <FormLabel>Pregunta #3</FormLabel>
          <Input {...register('secret.questionThree')} />
          <FormErrorMessage>{errors.secret?.questionThree?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerThree} isRequired>
          <FormLabel>Respuesta</FormLabel>
          <Input {...register('secret.answerThree')} />
          <FormErrorMessage>{errors.secret?.answerThree?.message}</FormErrorMessage>
        </FormControl>

        <Input hidden defaultValue={1} {...register('statusId', { valueAsNumber: true })} />
      </SimpleGrid>

      <Controller
        control={control}
        name="roles"
        render={({ field }) => (
          <FormControl isInvalid={!!errors.roles} isRequired>
            <FormLabel>Roles</FormLabel>
            <RSelect
              placeholder="Seleccionar roles..."
              isMulti
              options={selectOptions}
              closeMenuOnSelect={false}
              {...field}
            />
            <FormErrorMessage>{errors.roles?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    </Stack>
  )
}
