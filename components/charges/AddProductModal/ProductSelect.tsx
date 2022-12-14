import { Select } from 'chakra-react-select'
import { useProductsByCategory } from 'hooks/useProductsByCategory'
import { useEffect } from 'react'

interface ProductSelectProps {
  categoryId?: number
  value: number
  onChange: (value?: number) => void
}

export const ProductSelect = ({ categoryId, onChange, value }: ProductSelectProps) => {
  const { products, isLoading } = useProductsByCategory({ categoryId })

  useEffect(() => {
    if (!products || !products[0]) return
    onChange(products[0].id)
  }, [onChange, products])

  return (
    <Select
      options={products}
      getOptionLabel={(opt) => opt.name}
      getOptionValue={(opt) => opt.id.toString()}
      onChange={(value) => onChange(value?.id)}
      value={products?.find((p) => p.id === value)}
      placeholder={!categoryId ? 'No ha seleccionado ninguna categoría' : 'Buscar producto'}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `Sin resultados para "${inputValue}"` : 'Busque un producto'
      }
      isLoading={!!categoryId && isLoading}
      loadingMessage={() => 'Cargando...'}
    />
  )
}
