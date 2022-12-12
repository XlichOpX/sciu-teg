import { FormControl, FormErrorMessage, FormLabel, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PersonInputs } from 'components/app'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { createClientSchema } from 'schema/clientSchema'
import { CreateClientInput } from 'types/client'
import { OccupationSelect } from './OccupationSelect'

export type ClientFormData = CreateClientInput
export type ClientFormSubmitHandler = SubmitHandler<ClientFormData>

export const ClientForm = ({ id, onSubmit }: { id: string; onSubmit: ClientFormSubmitHandler }) => {
  const methods = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      docNumber: '',
      email: '',
      firstLastName: '',
      firstName: '',
      landline: ''
    }
  })

  const {
    formState: { errors }
  } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={id} noValidate autoComplete="off">
        <Stack gap={3}>
          <PersonInputs />

          <FormControl isInvalid={!!errors.occupationId} isRequired>
            <FormLabel>Ocupación</FormLabel>
            <Controller
              name="occupationId"
              render={({ field: { onChange, name, onBlur, ref } }) => (
                <OccupationSelect
                  onChange={(nv) => onChange(nv?.value)}
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                />
              )}
            />
            <FormErrorMessage>{errors.occupationId?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </form>
    </FormProvider>
  )
}
