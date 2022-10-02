import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { GetProductsResponse } from 'types/product'
import usePagination from './usePagination'

function useProducts({ itemsPerPage }: { itemsPerPage: number }) {
  const [search, setSearch] = useState('')
  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })

  const { data, error, mutate } = useSWR<GetProductsResponse, Error>(
    `/api/product?offset=${offset}&limit=${limit}${search ? `&keyword=${search}` : ''}`
  )

  useEffect(() => {
    setPage(1)
  }, [search, setPage])

  return {
    products: data?.result,
    count: data?.count,
    page,
    setPage,
    setSearch,
    pages: data?.count && Math.ceil(data.count / itemsPerPage),
    error,
    isLoading: !data && !error,
    mutate
  }
}

export default useProducts
