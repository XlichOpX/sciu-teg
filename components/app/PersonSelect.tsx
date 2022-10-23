import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { Select as RSelect } from 'chakra-react-select'
import { usePersons } from 'hooks'
import debounce from 'just-debounce'
import { Controller, UseFormReturn } from 'react-hook-form'

export const PersonSelect = ({
  formHook
}: {
  formHook: UseFormReturn<{ personId: number } & Record<string, unknown>>
}) => {
  const { selectOptions, setSearch, isLoading } = usePersons()
  const debouncedSetSearch = debounce(setSearch, 275)

  const {
    control,
    formState: { errors }
  } = formHook

  return (
    <Controller
      control={control}
      name="personId"
      render={({ field }) => (
        <FormControl isInvalid={!!errors.personId}>
          <RSelect
            options={selectOptions}
            {...field}
            value={selectOptions?.find((so) => so.value === field.value)}
            onChange={(newValue) => field.onChange(newValue?.value)}
            onInputChange={(nv, am) => {
              if (am.action === 'input-change') {
                debouncedSetSearch(nv)
              }
            }}
            isLoading={isLoading}
            placeholder="Buscar persona..."
          />
          <FormErrorMessage>{errors.personId?.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
