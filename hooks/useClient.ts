import { getClient } from 'services/clients'
import useSWR from 'swr'

export const useClient = (docNum: string) => {
  const { data, error } = useSWR(docNum ? `/api/client?keyword=${docNum}` : null, () =>
    getClient(docNum)
  )

  return {
    client: data,
    error,
    errorMsg: error?.message,
    isLoading: !data && !error
  }
}
