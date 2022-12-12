import { useToast } from '@chakra-ui/react'
import { Occupation } from '@prisma/client'
import {
  AsyncCreatableProps,
  AsyncCreatableSelect,
  GroupBase,
  OptionBase
} from 'chakra-react-select'
import { HttpError } from 'lib/http-error'
import { forwardRef, useState } from 'react'
import { createOccupation, getOccupations } from 'services/occupations'

interface Option extends OptionBase {
  label: string
  value: number
}

const getOption = (occupation: Occupation) => ({
  label: occupation.occupation,
  value: occupation.id
})

export interface OccupationSelectProps
  extends AsyncCreatableProps<Option, false, GroupBase<Option>> {
  onChange: (value: Option | null) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OccupationSelect = forwardRef<any, OccupationSelectProps>(
  ({ onChange, ...props }, ref) => {
    const [value, setValue] = useState<Option | null>(null)

    const toast = useToast()

    const promiseOptions = async (search: string) => (await getOccupations(search)).map(getOption)

    const handleChange = (value: Option | null) => {
      setValue(value)
      onChange(value)
    }

    const handleCreate = async (occupation: string) => {
      try {
        const newOccupation = await createOccupation(occupation)
        handleChange(getOption(newOccupation))
      } catch (error) {
        if (error instanceof HttpError) {
          toast({ status: 'error', description: error.message })
        }
      }
    }

    return (
      <AsyncCreatableSelect<Option, false, GroupBase<Option>>
        onCreateOption={handleCreate}
        loadOptions={promiseOptions}
        value={value}
        onChange={handleChange}
        ref={ref}
        loadingMessage={() => 'Cargando...'}
        noOptionsMessage={({ inputValue }) =>
          inputValue === ''
            ? 'Escriba para buscar ocupaciones'
            : `Sin resultados para "${inputValue}"`
        }
        formatCreateLabel={(inputValue) => `Crear ocupación "${inputValue}"`}
        placeholder="Seleccionar ocupación"
        {...props}
      />
    )
  }
)

OccupationSelect.displayName = 'OccupationSelect'
