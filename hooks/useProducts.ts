import useSWR from 'swr'

function useProducts() {
  const { data, error } = useSWR('/api/product')
  return { products: data, error, isLoading: !data && !error }
}

export default useProducts
