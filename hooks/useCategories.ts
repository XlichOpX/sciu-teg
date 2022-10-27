import { useToast } from '@chakra-ui/react'
import { Category } from '@prisma/client'
import { useState } from 'react'
import {
  createCategory as createCategorySv,
  deleteCategory as deleteCategorySv,
  updateCategory as updateCategorySv
} from 'services/categories'
import useSWR from 'swr'
import { CategoryInput } from 'types/category'

export const useCategories = () => {
  const [search, setSearch] = useState('')
  const { data, error, mutate } = useSWR<Category[], Error>('/api/category')
  const toast = useToast()

  const createCategory = async (data: CategoryInput) => {
    await createCategorySv(data)
    await mutate()
    toast({ status: 'success', description: 'Categoría creada' })
  }

  const updateCategory = async (id: number, data: CategoryInput) => {
    await updateCategorySv(id, data)
    await mutate()
    toast({ status: 'success', description: 'Categoría actualizada' })
  }

  const deleteCategory = async (id: number) => {
    try {
      await deleteCategorySv(id)
      await mutate()
      toast({ status: 'success', description: 'Categoría eliminada' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'No se pudo eliminar la categoría' })
      }
    }
  }

  return {
    categories: data?.filter((c) => c.name.toLocaleLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    createCategory,
    updateCategory,
    deleteCategory,
    search,
    setSearch
  }
}
