import { Role } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'

export const useRoles = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Role[], Error>('/api/role')
  return { roles: data?.filter((r) => r.name.toLowerCase().includes(search)), error, setSearch }
}
