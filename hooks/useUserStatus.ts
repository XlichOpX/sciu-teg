import { UserStatus } from '@prisma/client'
import { HttpError } from 'lib/http-error'
import useSWR from 'swr'

export const useUserStatus = () => {
  const { data, error } = useSWR<UserStatus[], HttpError>('/api/userStatus')
  return { userStatus: data, error, isLoading: !data && !error }
}
