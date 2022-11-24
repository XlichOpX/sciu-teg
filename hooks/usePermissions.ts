import { Permission } from '@prisma/client'
import { HttpError } from 'lib/http-error'
import useSWR from 'swr'

export const usePermissions = () => {
  const { data: permissions, error } = useSWR<Permission[], HttpError>('/api/permission')
  const selectOptions = permissions?.map((p) => ({ value: p.id, label: p.description }))

  return { permissions, error, selectOptions }
}
