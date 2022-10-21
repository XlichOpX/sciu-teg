import { UserStatus } from '@prisma/client'
import useSWR from 'swr'

export const useUserStatus = () => {
  const { data, error } = useSWR<UserStatus[], Error>('/api/userStatus')
  return { userStatus: data, error }
}
