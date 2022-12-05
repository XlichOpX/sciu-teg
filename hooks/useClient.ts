import { getClient } from 'services/clients'
import useSWR from 'swr'

export const useClient = (clientId: string) => {
  const { data, error } = useSWR(clientId ? `/api/client/${clientId}` : null, () =>
    getClient(clientId)
  )

  return {
    client: data,
    error,
    errorMsg: error?.message,
    isLoading: !data && !error
  }
}
