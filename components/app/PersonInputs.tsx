import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid
} from '@chakra-ui/react'
import { PersonFormData } from 'components/app'
import { useDocTypes } from 'hooks'
import { useFormContext } from 'react-hook-form'
import { FullyCenteredSpinner } from './FullyCenteredSpinner'

export const PersonInputs = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PersonFormData>()

  const { docTypes } = useDocTypes()
  if (!docTypes) return <FullyCenteredSpinner />

  return (
    <SimpleGrid columns={[1, 2]} gap={4}>
      <FormControl isInvalid={!!errors.firstName} isRequired>
        <FormLabel>Primer nombre</FormLabel>
        <Input {...register('firstName')} />
        <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.middleName}>
        <FormLabel>Segundo nombre</FormLabel>
        <Input {...register('middleName')} />
        <FormErrorMessage>{errors.middleName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.firstLastName} isRequired>
        <FormLabel>Primer apellido</FormLabel>
        <Input {...register('firstLastName')} />
        <FormErrorMessage>{errors.firstLastName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.secondLastName}>
        <FormLabel>Segundo apellido</FormLabel>
        <Input {...register('secondLastName')} />
        <FormErrorMessage>{errors.secondLastName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="docNumber" isInvalid={!!errors.docNumber} isRequired>
        <FormLabel htmlFor="docNumber">Documento de identidad</FormLabel>
        <Flex>
          <FormLabel hidden htmlFor="docTypeId">
            Tipo de documento
          </FormLabel>
          <Select
            w="33%"
            id="docTypeId"
            {...register('docTypeId', { valueAsNumber: true })}
            borderRightRadius={0}
          >
            {docTypes?.map((dt) => (
              <option key={dt.id} value={dt.id}>
                {dt.type}
              </option>
            ))}
          </Select>
          <Input {...register('docNumber')} borderLeftRadius={0} />
        </Flex>
        <FormErrorMessage>{errors.docNumber?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.email} isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" {...register('email')} />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.landline} isRequired>
        <FormLabel>Teléfono</FormLabel>
        <Input type="tel" {...register('landline')} />
        <FormErrorMessage>{errors.landline?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.address} isRequired>
        <FormLabel>Dirección</FormLabel>
        <Input {...register('address')} />
        <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  )
}
