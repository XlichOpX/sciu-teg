import {
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select as RSelect } from 'chakra-react-select'
import { useDocTypes, useRoles, useUserStatus } from 'hooks'
import type { SubmitHandler, UseFormRegister } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { userSchema } from 'schema/userSchema'
import { z } from 'zod'

export type UserFormData = z.infer<typeof userSchema>
export type UserFormSubmitHandler = SubmitHandler<UserFormData>

interface UserFormProps {
  onSubmit: UserFormSubmitHandler
  id: string
}

export const UserForm = ({ onSubmit, id }: UserFormProps) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  })
  const { selectOptions } = useRoles()
  const { userStatus } = useUserStatus()

  return (
    <VStack
      as="form"
      align="stretch"
      onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
      id={id}
      gap={4}
      noValidate
    >
      <Heading as="h3" size="sm">
        Datos personales
      </Heading>
      <PersonInputs register={register} />

      <Divider />

      <Heading as="h3" size="sm">
        Datos del usuario
      </Heading>
      <SimpleGrid columns={[1, 2]} gap={4}>
        <FormControl isInvalid={!!errors.username}>
          <FormLabel>Nombre de usuario</FormLabel>
          <Input {...register('username')} />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Contraseña</FormLabel>
          <Input type="password" autoComplete="new-password" {...register('password')} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={[1, 2]} gap={4}>
        <FormControl isInvalid={!!errors.secret?.questionOne}>
          <FormLabel>Pregunta #1</FormLabel>
          <Input {...register('secret.questionOne')} />
          <FormErrorMessage>{errors.secret?.questionOne?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerOne}>
          <FormLabel>Respuesta</FormLabel>
          <Input type="password" {...register('secret.answerOne')} />
          <FormErrorMessage>{errors.secret?.answerOne?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.questionTwo}>
          <FormLabel>Pregunta #2</FormLabel>
          <Input {...register('secret.questionTwo')} />
          <FormErrorMessage>{errors.secret?.questionTwo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerTwo}>
          <FormLabel>Respuesta</FormLabel>
          <Input type="password" {...register('secret.answerTwo')} />
          <FormErrorMessage>{errors.secret?.answerTwo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.questionThree}>
          <FormLabel>Pregunta #3</FormLabel>
          <Input {...register('secret.questionThree')} />
          <FormErrorMessage>{errors.secret?.questionThree?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.secret?.answerThree}>
          <FormLabel>Respuesta</FormLabel>
          <Input type="password" {...register('secret.answerThree')} />
          <FormErrorMessage>{errors.secret?.answerThree?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <Controller
        control={control}
        name="roles"
        render={({ field }) => (
          <FormControl isInvalid={!!errors.roles}>
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

      <FormControl isInvalid={!!errors.statusId}>
        <FormLabel>Status</FormLabel>
        <Select {...register('statusId', { valueAsNumber: true })}>
          {userStatus?.map((us) => (
            <option key={us.id} value={us.id}>
              {us.status}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.statusId?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

const PersonInputs = ({ register }: { register: UseFormRegister<UserFormData> }) => {
  const { docTypes } = useDocTypes()

  return (
    <SimpleGrid columns={[1, 2]} gap={4}>
      <FormControl>
        <FormLabel>Primer nombre</FormLabel>
        <Input {...register('person.firstName')} />
      </FormControl>

      <FormControl>
        <FormLabel>Segundo nombre</FormLabel>
        <Input {...register('person.middleName')} />
      </FormControl>

      <FormControl>
        <FormLabel>Primer apellido</FormLabel>
        <Input {...register('person.firstLastName')} />
      </FormControl>

      <FormControl>
        <FormLabel>Segundo apellido</FormLabel>
        <Input {...register('person.secondLastName')} />
      </FormControl>

      <div>
        <FormLabel htmlFor="docNumber">Documento de identidad</FormLabel>
        <Flex>
          <FormControl w="33%">
            <FormLabel hidden>Tipo de documento</FormLabel>
            <Select
              {...register('person.docTypeId', { valueAsNumber: true })}
              borderRightRadius={0}
            >
              {docTypes?.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.type}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="docNumber">
            <Input {...register('person.docNumber')} borderLeftRadius={0} />
          </FormControl>
        </Flex>
      </div>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" {...register('person.email')} />
      </FormControl>

      <FormControl>
        <FormLabel>Teléfono</FormLabel>
        <Input type="tel" {...register('person.landline')} />
      </FormControl>

      <FormControl>
        <FormLabel>Dirección</FormLabel>
        <Input {...register('person.address')} />
      </FormControl>
    </SimpleGrid>
  )
}
