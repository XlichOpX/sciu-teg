import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  createProduct as createProductSv,
  deleteProduct as deleteProductSv,
  updateProduct as updateProductSv
} from 'services/products'
import useSWR from 'swr'
import { GetProductsResponse, ProductInput } from 'types/product'
import { usePagination } from './usePagination'

export const useProducts = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const [search, setSearch] = useState('')
  const toast = useToast()

  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })
  const { data, error, mutate } = useSWR<GetProductsResponse, Error>(
    `/api/product?offset=${offset}&limit=${limit}${search ? `&keyword=${search}` : ''}`
  )

  useEffect(() => {
    setPage(1)
  }, [search, setPage])

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
    setSearch,
    pages: data?.count && Math.ceil(data.count / itemsPerPage),
    error,
    isLoading: !data && !error,
    updateProduct,
    deleteProduct,
    createProduct
  }
}
