import { ProductWithCategory } from 'types/product'
import useSWR from 'swr'

function useProducts() {
  const { data, error, mutate } = useSWR<ProductWithCategory[], Error>('/api/product')
  return { products: data, error, isLoading: !data && !error, mutate }
}

export default useProducts
