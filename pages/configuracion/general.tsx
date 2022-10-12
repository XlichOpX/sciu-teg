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
import { Layout } from 'components/settings'
import useParameters from 'hooks/useParameters'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { parametersSchema } from 'schema/parametersSchema'

const GeneralSettings: NextPageWithLayout = () => {
  const { parameters, updateParameters } = useParameters()

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
    if (!parameters) return
    if (!isDirty) return
    await updateParameters(parameters.id, data)
  }

  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Datos de la Institución
      </Heading>

      <VStack as="form" align="stretch" gap={4} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={[1, 2]} gap={4}>
          <FormControl isInvalid={!!errors.institute}>
            <FormLabel>Nombre</FormLabel>
            <Input {...register('institute')} />
            <FormErrorMessage>{errors.institute?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.rif}>
            <FormLabel>RIF</FormLabel>
            <Input {...register('rif')} />
            <FormErrorMessage>{errors.rif?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={!!errors.address}>
          <FormLabel>Dirección</FormLabel>
          <Input {...register('address')} />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>

        <SimpleGrid columns={[1, 2]} gap={4}>
          <FormControl isInvalid={!!errors.population}>
            <FormLabel>Zona</FormLabel>
            <Input {...register('population')} />
            <FormErrorMessage>{errors.population?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>Teléfono</FormLabel>
            <Input {...register('phone')} />
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <SaveButton type="submit" disabled={isSubmitting} />
      </VStack>
    </>
  )
}

GeneralSettings.getLayout = (page) => <Layout title="General">{page}</Layout>

export default GeneralSettings
