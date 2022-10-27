import { Role } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'

export const useRoles = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Role[], Error>('/api/role')
  const selectOptions = data?.map((p) => ({ value: p.id, label: p.name }))
  return {
    roles: data?.filter((r) => r.name.toLowerCase().includes(search)),
    error,
    setSearch,
    selectOptions,
    isLoading: !data && !error
  }
}

export const roleKeysMatcher = '^/api/role*'
