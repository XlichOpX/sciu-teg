import { Select } from 'chakra-react-select'
import { useCategories } from 'hooks'
import { useEffect } from 'react'

export const CategorySelect = ({
  onChange,
  value
}: {
  onChange: (value?: number) => void
  value?: number
}) => {
  const { categories, isLoading } = useCategories()

  useEffect(() => {
    if (!categories || !categories[0]) return
    onChange(categories[0].id)
  }, [categories, onChange])

  return (
    <Select
      options={categories}
      getOptionLabel={(opt) => opt.name}
      getOptionValue={(opt) => opt.id.toString()}
      onChange={(value) => onChange(value?.id)}
      value={categories?.find((c) => c.id === value)}
      placeholder="Buscar categoría"
      noOptionsMessage={({ inputValue }) => `Sin resultados para "${inputValue}"`}
      isLoading={isLoading}
    />
  )
}
