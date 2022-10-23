import {
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'
import { useDocTypes, usePersons } from 'hooks'
import { type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import { personSchema } from 'schema/userSchema'
import { z } from 'zod'

export const personFormSchema = z.object({
  isNewPerson: z.boolean(),
  personId: z.number({ invalid_type_error: 'Seleccione una persona' }).optional(),
  person: personSchema.optional()
})

export type PersonFormData = z.infer<typeof personFormSchema>

export const PersonForm = ({
  formHook,
  onSubmit,
  id
}: {
  formHook: UseFormReturn<PersonFormData>
  onSubmit: SubmitHandler<PersonFormData>
  id: string
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = formHook

  const { docTypes } = useDocTypes()
  const { selectOptions } = usePersons()

  const isNewPerson = watch('isNewPerson')

  return (
    <>
      <Checkbox defaultChecked {...register('isNewPerson')} mb={4}>
        Es una nueva persona
      </Checkbox>

      <Stack as="form" gap={2} onSubmit={handleSubmit(onSubmit)} id={id}>
        {!isNewPerson && (
          <FormControl isInvalid={!!errors.personId}>
            <Select
              {...register('personId', {
                valueAsNumber: true
              })}
              defaultValue=""
            >
              <option value="" disabled>
                Seleccionar persona existente...
              </option>
              {selectOptions?.map((so) => (
                <option key={so.value} value={so.value}>
                  {so.label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.personId?.message}</FormErrorMessage>
          </FormControl>
        )}

        {isNewPerson && (
          <SimpleGrid columns={[1, 2]} gap={4}>
            <FormControl isInvalid={!!errors.person?.firstName}>
              <FormLabel>Primer nombre</FormLabel>
              <Input {...register('person.firstName')} />
              <FormErrorMessage>{errors.person?.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.person?.middleName}>
              <FormLabel>Segundo nombre</FormLabel>
              <Input {...register('person.middleName')} />
              <FormErrorMessage>{errors.person?.middleName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.person?.firstLastName}>
              <FormLabel>Primer apellido</FormLabel>
              <Input {...register('person.firstLastName')} />
              <FormErrorMessage>{errors.person?.firstLastName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.person?.secondLastName}>
              <FormLabel>Segundo apellido</FormLabel>
              <Input {...register('person.secondLastName')} />
              <FormErrorMessage>{errors.person?.secondLastName?.message}</FormErrorMessage>
            </FormControl>

            <div>
              <FormLabel htmlFor="docNumber">Documento de identidad</FormLabel>
              <Flex>
                <FormControl w="33%" isInvalid={!!errors.person?.docTypeId}>
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

                <FormControl id="docNumber" isInvalid={!!errors.person?.docNumber}>
                  <Input {...register('person.docNumber')} borderLeftRadius={0} />
                </FormControl>
              </Flex>
              <FormErrorMessage>{errors.person?.docNumber?.message}</FormErrorMessage>
            </div>

            <FormControl isInvalid={!!errors.person?.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('person.email')} />
              <FormErrorMessage>{errors.person?.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.person?.landline}>
              <FormLabel>Teléfono</FormLabel>
              <Input type="tel" {...register('person.landline')} />
              <FormErrorMessage>{errors.person?.landline?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.person?.address}>
              <FormLabel>Dirección</FormLabel>
              <Input {...register('person.address')} />
              <FormErrorMessage>{errors.person?.address?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        )}
      </Stack>
    </>
  )
}