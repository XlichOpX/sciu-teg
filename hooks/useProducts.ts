import { useCallback, useState } from 'react'
import useSWR from 'swr'
import { GetProductsResponse } from 'types/product'
import { calcPages } from 'utils/calcPages'
import { usePagination } from './usePagination'

export const useProducts = ({
  itemsPerPage,
  savePage = true
}: {
  itemsPerPage: number
  savePage?: boolean
}) => {
  const [search, setSearchState] = useState('')

  const { page, offset, limit, setPage } = usePagination({ itemsPerPage, savePage })
  const { data, error } = useSWR<GetProductsResponse, Error>(
    `/api/product?offset=${offset}&limit=${limit}${search ? `&keyword=${search}` : ''}`
  )

  const setSearch = useCallback(
    (search: string) => {
      setSearchState(search)
      setPage(1)
    },
    [setPage]
  )

  return {
    products: data?.result,
    count: data?.count,
    page,
    setPage,
    setSearch,
    pages: data?.count && calcPages(data.count, itemsPerPage),
    error,
    isLoading: !data && !error,
    search
  }
}

export const productKeysMatcher = '/api/product*'
