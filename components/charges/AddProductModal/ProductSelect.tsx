import { Select } from 'chakra-react-select'
import { useProducts } from 'hooks'
import debounce from 'just-debounce'
import { useEffect, useMemo, useState } from 'react'

interface ProductSelectProps {
  categoryId?: number
  value: number
  onChange: (value?: number) => void
}

export const ProductSelect = ({ categoryId, onChange, value }: ProductSelectProps) => {
  const { products, setSearch, isLoading } = useProducts({ itemsPerPage: 15, savePage: false })

  const filteredProducts = useMemo(
    () => products?.filter((p) => p.categoryId === categoryId),
    [categoryId, products]
  )

  useEffect(() => {
    if (!filteredProducts || !filteredProducts[0]) return
    onChange(filteredProducts[0].id)
  }, [onChange, filteredProducts])

  const [inputValue, setInputValue] = useState('')
  const debouncedSetSearch = useMemo(() => debounce(setSearch, 300), [setSearch])

  return (
    <Select
      options={filteredProducts}
      getOptionLabel={(opt) => opt.name}
      getOptionValue={(opt) => opt.id.toString()}
      onChange={(value) => onChange(value?.id)}
      value={filteredProducts?.find((p) => p.id === value)}
      placeholder="Buscar producto"
      noOptionsMessage={({ inputValue }) => `Sin resultados para "${inputValue}"`}
      inputValue={inputValue}
      onInputChange={(nv) => {
        setInputValue(nv)
        debouncedSetSearch(nv)
      }}
      isLoading={isLoading}
      filterOption={() => true}
    />
  )
}
