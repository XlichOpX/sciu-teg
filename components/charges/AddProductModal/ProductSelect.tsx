import { Select } from 'chakra-react-select'
import { useProducts } from 'hooks'

interface ProductSelectProps {
  categoryId?: number
  value: number
  onChange: (value?: number) => void
}

export const ProductSelect = ({ categoryId, onChange, value }: ProductSelectProps) => {
  const { products } = useProducts({ itemsPerPage: 100 })
  const filteredProducts = products?.filter((p) => p.categoryId === categoryId)

  return (
    <Select
      options={filteredProducts}
      getOptionLabel={(opt) => opt.name}
      getOptionValue={(opt) => opt.id.toString()}
      onChange={(value) => onChange(value?.id)}
      value={filteredProducts?.find((p) => p.id === value)}
      placeholder="Buscar producto"
      noOptionsMessage={({ inputValue }) => `Sin resultados para "${inputValue}"`}
    />
  )
}
