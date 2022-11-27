import { Role } from '@prisma/client'
import { HttpError } from 'lib/http-error'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export const useRoles = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Role[], HttpError>('/api/role')
  const selectOptions = data?.map((p) => ({ value: p.id, label: p.name }))

  const roles = useMemo(
    () => data?.filter((r) => r.name.toLowerCase().includes(search)),
    [data, search]
  )

  return {
    roles,
    error,
    setSearch,
    selectOptions,
    isLoading: !data && !error
  }
}

export const roleKeysMatcher = '^/api/role*'
