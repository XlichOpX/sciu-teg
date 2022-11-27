import { getProductsByCategory } from 'services/products'
import useSWR from 'swr'

/** Gets products by the given category. If no categoryId is given, it won't fetch */
export const useProductsByCategory = ({ categoryId }: { categoryId?: number }) => {
  const { data, error } = useSWR(categoryId ? `/api/products?category=${categoryId}` : null, () => {
    if (categoryId) return getProductsByCategory(categoryId)
  })

  return {
    products: data?.products,
    isLoading: !data && !error
  }
}
