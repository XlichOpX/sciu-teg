import { ProductWithCategory } from 'types/product'
import useSWR from 'swr'

function useProducts() {
  const { data, error } = useSWR<ProductWithCategory[], Error>('/api/product')
  return { products: data, error, isLoading: !data && !error }
}

export default useProducts
