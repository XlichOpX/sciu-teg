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
  const { categories, isLoading, error } = useCategories()

  const cantReadCategories = error?.statusCode === 403

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
      placeholder={
        cantReadCategories ? 'No tiene permiso para leer categorías' : 'Buscar categoría'
      }
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `Sin resultados para "${inputValue}"` : 'Busque una categoría'
      }
      isLoading={isLoading}
      loadingMessage={() => 'Cargando...'}
    />
  )
}
