import { HttpError } from 'lib/http-error'
import useSWR from 'swr'
import { ClientWithPersonAndOccupation } from 'types/client'

export const useClient = (docNum?: string) => {
  const { data, error } = useSWR<ClientWithPersonAndOccupation, HttpError>(
    docNum ? `/api/client/${docNum}` : null
  )

  return {
    client: data,
    error,
    isLoading: !data && !error
  }
}
