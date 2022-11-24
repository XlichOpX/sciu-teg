import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Parameters } from '@prisma/client'
import { SaveButton } from 'components/app'
import { useAuth, useParameters } from 'hooks'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { parametersSchema } from 'schema/parametersSchema'
import { createParameters } from 'services/parameters'

export const InstituteDataForm = () => {
  const { parameters, updateParameters } = useParameters()
  const { user } = useAuth()
  const canUserEdit = user?.permissions.includes('EDIT_PARAMETER')

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<Parameters>({ defaultValues: parameters, resolver: zodResolver(parametersSchema) })

  useEffect(() => {
    reset(parameters)
  }, [parameters, reset])

  const onSubmit: SubmitHandler<Parameters> = async (data) => {
    if (!isDirty) return
    if (!parameters) {
      return await createParameters(data)
    }
    await updateParameters(parameters.id, data)
  }

  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Datos de la Institución
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!canUserEdit}>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={[1, 2]} gap={4}>
              <FormControl isInvalid={!!errors.institute} isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input {...register('institute')} />
                <FormErrorMessage>{errors.institute?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.rif} isRequired>
                <FormLabel>RIF</FormLabel>
                <Input {...register('rif')} />
                <FormErrorMessage>{errors.rif?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={!!errors.address} isRequired>
              <FormLabel>Dirección</FormLabel>
              <Input {...register('address')} />
              <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={[1, 2]} gap={4}>
              <FormControl isInvalid={!!errors.population} isRequired>
                <FormLabel>Zona</FormLabel>
                <Input {...register('population')} />
                <FormErrorMessage>{errors.population?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone} isRequired>
                <FormLabel>Teléfono</FormLabel>
                <Input {...register('phone')} />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </VStack>
        </fieldset>

        {canUserEdit && <SaveButton mt={4} type="submit" isLoading={isSubmitting} />}
      </form>
    </>
  )
}
