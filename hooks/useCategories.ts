import { Category } from '@prisma/client'
import useSWR from 'swr'
import { CategoryInput } from 'types/category'
import {
  createCategory as createCategorySv,
  updateCategory as updateCategorySv,
  deleteCategory as deleteCategorySv
} from 'services/categories'
import { useToast } from '@chakra-ui/react'

function useCategories() {
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
    categories: data,
    error,
    isLoading: !data && !error,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export default useCategories
