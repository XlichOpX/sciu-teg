import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import {
  createProduct as createProductSv,
  deleteProduct as deleteProductSv,
  updateProduct as updateProductSv
} from 'services/products'
import useSWR from 'swr'
import { GetProductsResponse, ProductInput } from 'types/product'
import { calcPages } from 'utils/calcPages'
import { usePagination } from './usePagination'

export const useProducts = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const [search, setSearchState] = useState('')
  const toast = useToast()

  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })
  const { data, error, mutate } = useSWR<GetProductsResponse, Error>(
    `/api/product?offset=${offset}&limit=${limit}${search ? `&keyword=${search}` : ''}`
  )

  const createProduct = async (data: ProductInput) => {
    await createProductSv(data)
    await mutate()
    toast({ status: 'success', description: 'Producto creado' })
  }

  const updateProduct = async (id: number, data: ProductInput) => {
    await updateProductSv(id, data)
    await mutate()
    toast({ status: 'success', description: 'Producto actualizado' })
  }

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

  return {
    products: data?.result,
    count: data?.count,
    page,
    setPage,
    setSearch: (search: string) => {
      setSearchState(search)
      setPage(1)
    },
    pages: data?.count && calcPages(data.count, itemsPerPage),
    error,
    isLoading: !data && !error,
    updateProduct,
    deleteProduct,
    createProduct
  }
}
