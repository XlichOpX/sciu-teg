import { Category } from '@prisma/client'
import useSWR from 'swr'

function useCategories() {
  const { data, error } = useSWR<Category[]>('/api/category')
  return { categories: data, error, isLoading: !data && !error }
}

export default useCategories
