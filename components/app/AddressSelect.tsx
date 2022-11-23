import { Address } from '@prisma/client'
import { CreatableSelect } from 'chakra-react-select'
import { useAddresses } from 'hooks'
import debounce from 'just-debounce'
import { useMemo, useState } from 'react'
import { createAddress } from 'services/addresses'

const getOption = (address: Address) => ({ label: address.shortAddress, value: address.id })

interface Option {
  label: string
  value: number
}

export const AddressSelect = ({
  onChange,
  initialValue = null
}: {
  onChange: (newVal: Option | null) => void
  initialValue?: Option | null
}) => {
  const [value, setValue] = useState<Option | null>(initialValue)
  const [inputValue, setInputValue] = useState('')

  const [search, _setSearch] = useState('')
  const setSearch = useMemo(() => debounce(_setSearch, 275), [])

  const { addresses, isLoading, mutate } = useAddresses({ search })
  const options = addresses?.map(getOption)

  const handleCreate = async (val: string) => {
    const newAddress = getOption(await createAddress(val))
    mutate()
    setValue(newAddress)
    onChange(newAddress)
  }

  return (
    <CreatableSelect
      placeholder=""
      noOptionsMessage={({ inputValue }) =>
        inputValue ? 'Sin resultados' : 'Escriba una dirección'
      }
      loadingMessage={() => 'Cargando...'}
      options={options}
      isLoading={isLoading}
      formatCreateLabel={(val) => `Nueva dirección: "${val}"`}
      onCreateOption={handleCreate}
      inputValue={inputValue}
      onInputChange={(newVal) => {
        setInputValue(newVal)
        setSearch(newVal)
      }}
      value={value}
      onChange={(newVal) => {
        setValue(newVal)
        onChange(newVal)
      }}
    />
  )
}
