import { User } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'

function useUsers() {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<User[], Error>('/api/user')
  return { users: data?.filter((u) => u.username.toLowerCase().includes(search)), error, setSearch }
}

export default useUsers
