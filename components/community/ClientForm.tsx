import { Stack } from '@chakra-ui/react'
import { PersonInputs } from 'components/app'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { OccupationSelect } from './OccupationSelect'

export const ClientForm = ({ id }: { id: string }) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))} id={id}>
        <Stack gap={3}>
          <PersonInputs />

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
        </Stack>
      </form>
    </FormProvider>
  )
}
