import { User } from '@prisma/client'
import useSWR from 'swr'

function useUsers() {
  const { data, error } = useSWR<User[], Error>('/api/user')
  return { users: data, error }
}

export default useUsers
