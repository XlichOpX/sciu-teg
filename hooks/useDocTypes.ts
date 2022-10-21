import { DocType } from '@prisma/client'
import useSWR from 'swr'

export const useDocTypes = () => {
  const { data, error } = useSWR<DocType[], Error>('/api/docType')
  return { docTypes: data, error }
}
