import { Category } from '@prisma/client'
import { HttpError } from 'lib/http-error'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export const useCategories = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Category[], HttpError>('/api/category')

  const categories = useMemo(
    () => data?.filter((c) => c.name.toLocaleLowerCase().includes(search)),
    [data, search]
  )

  return {
    categories,
    error,
    isLoading: !data && !error,
    search,
    setSearch,
    errorMsg: error
      ? error.statusCode === 403
        ? 'No tiene permiso para leer las categorías'
        : 'Error al obtener las categorías'
      : undefined
  }
}

export const categoryKeysMatcher = '^/api/category.*'
