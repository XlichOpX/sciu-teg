import { useState } from 'react'
import useSWR from 'swr'
import { UserEssencials } from 'types/user'

export const useUsers = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<UserEssencials[], Error>('/api/user')
  return {
    users: data?.filter((u) => u.username.toLowerCase().includes(search)),
    error,
    setSearch,
    isLoading: !data && !error
  }
}

export const userKeysMatcher = '^/api/user*'
