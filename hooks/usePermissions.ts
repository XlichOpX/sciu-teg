import { Permission } from '@prisma/client'
import useSWR from 'swr'

export const usePermissions = () => {
  const { data: permissions, error } = useSWR<Permission[], Error>('/api/permission')
  const selectOptions = permissions?.map((p) => ({ value: p.id, label: p.description }))

  return { permissions, error, selectOptions }
}
