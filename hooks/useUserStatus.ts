import { UserStatus } from '@prisma/client'
import { HttpError } from 'lib/http-error'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export const useUserStatus = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<UserStatus[], HttpError>('/api/userStatus')
  const userStatus = useMemo(
    () => data?.filter((s) => s.status.toLocaleLowerCase().includes(search)),
    [data, search]
  )
  return { userStatus, error, isLoading: !data && !error, setSearch }
}

export const userStatusKeysMatcher = '^/api/userStatus*'
