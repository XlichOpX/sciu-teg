import { useToast } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { deleteProduct as deleteProductSv } from 'services/products'
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
  const toast = useToast()

  const { page, offset, limit, setPage } = usePagination({ itemsPerPage, savePage })
  const { data, error, mutate } = useSWR<GetProductsResponse, Error>(
    `/api/product?offset=${offset}&limit=${limit}${search ? `&keyword=${search}` : ''}`
  )

  const deleteProduct = async (id: number) => {
    try {
      await deleteProductSv(id)
      await mutate()
      toast({ status: 'success', description: 'Producto eliminado' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: error.message })
      }
    }
  }

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
    deleteProduct,
    search
  }
}

export const productKeysMatcher = '/api/product*'
