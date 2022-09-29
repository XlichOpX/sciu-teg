import { ProductWithCategory } from 'pages/api/product'
import useSWR from 'swr'

function useProducts() {
  const { data, error } = useSWR<ProductWithCategory[]>('/api/product')
  return { products: data, error, isLoading: !data && !error }
}

export default useProducts
