import {
  Alert,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'
import { Select as RSelect } from 'chakra-react-select'
import { FullyCenteredSpinner } from 'components/app'
import { useRoles, useSecretQuestions } from 'hooks'
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
  const { selectOptions, error } = useRoles()
  const { secretQuestions } = useSecretQuestions()

  const cantReadRoles = error?.statusCode === 403

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = formHook

  const selectedQuestions = watch([
    'secret.questionOne',
    'secret.questionTwo',
    'secret.questionThree'
  ])

  if (cantReadRoles) return <Alert status="error">No tiene permisos para leer roles</Alert>
  if (!secretQuestions) return <FullyCenteredSpinner />

  return (
    <Stack
      gap={2}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      id={id}
      noValidate
      autoComplete="off"
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
          <Select {...register('secret.questionOne')} defaultValue={secretQuestions[0].question}>
            {secretQuestions.map((sq) => (
              <option
                key={sq.id}
                value={sq.question}
                disabled={
                  selectedQuestions[0] !== sq.question && selectedQuestions.includes(sq.question)
                }
              >
                {sq.question}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.secret?.questionOne?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerOne} isRequired>
          <FormLabel>Respuesta</FormLabel>
          <Input {...register('secret.answerOne')} />
          <FormErrorMessage>{errors.secret?.answerOne?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.questionTwo} isRequired>
          <FormLabel>Pregunta #2</FormLabel>
          <Select {...register('secret.questionTwo')} defaultValue={secretQuestions[1].question}>
            {secretQuestions.map((sq) => (
              <option
                key={sq.id}
                value={sq.question}
                disabled={
                  selectedQuestions[1] !== sq.question && selectedQuestions.includes(sq.question)
                }
              >
                {sq.question}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.secret?.questionTwo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerTwo} isRequired>
          <FormLabel>Respuesta</FormLabel>
          <Input {...register('secret.answerTwo')} />
          <FormErrorMessage>{errors.secret?.answerTwo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.questionThree} isRequired>
          <FormLabel>Pregunta #3</FormLabel>
          <Select {...register('secret.questionThree')} defaultValue={secretQuestions[2].question}>
            {secretQuestions.map((sq) => (
              <option
                key={sq.id}
                value={sq.question}
                disabled={
                  selectedQuestions[2] !== sq.question && selectedQuestions.includes(sq.question)
                }
              >
                {sq.question}
              </option>
            ))}
          </Select>
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
              noOptionsMessage={({ inputValue }) => `Sin resultados para "${inputValue}"`}
              {...field}
            />
            <FormErrorMessage>{errors.roles?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    </Stack>
  )
}
