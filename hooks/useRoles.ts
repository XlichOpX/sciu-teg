import { HttpError } from 'lib/http-error'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { RoleWithPermissions } from 'types/role'

export const useRoles = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<RoleWithPermissions[], HttpError>('/api/role')
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
