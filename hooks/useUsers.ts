import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { UserEssentials } from 'types/user'

export const useUsers = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<UserEssentials[], Error>('/api/user')

  const users = useMemo(
    () => data?.filter((u) => u.username.toLowerCase().includes(search)),
    [data, search]
  )

  return {
    users,
    error,
    setSearch,
    isLoading: !data && !error
  }
}

export const userKeysMatcher = '^/api/user*'
