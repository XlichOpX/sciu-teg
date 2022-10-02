import useSWR from 'swr'
import { GetProductsResponse } from 'types/product'
import usePagination from './usePagination'

function useProducts({ itemsPerPage }: { itemsPerPage: number }) {
  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })
  const { data, error, mutate } = useSWR<GetProductsResponse, Error>(
    `/api/product?offset=${offset}&limit=${limit}`
  )
  const { result, count } = data || {}

  const pages = count ? Math.ceil(count / itemsPerPage) : undefined

  return {
    products: result,
    count,
    page,
    setPage,
    pages,
    error,
    isLoading: !data && !error,
    mutate
  }
}

export default useProducts
