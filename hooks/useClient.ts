import { HttpError } from 'lib/http-error'
import useSWR from 'swr'
import { ClientWithPersonAndOccupation } from 'types/client'

export const useClient = (docNum?: string) => {
  const { data, error: originalError } = useSWR<
    { count: number; result: ClientWithPersonAndOccupation[] },
    HttpError
  >(docNum ? `/api/client?keyword=${docNum}` : null)

  const isLoading = !data && !originalError

  let error = originalError
  if (!isLoading && !data?.result[0]) {
    error = new HttpError({ message: 'Cliente no encontrado', statusCode: 404 })
  }

  return {
    client: data?.result[0],
    error,
    errorMsg: error
      ? error.statusCode === 404
        ? error.message
        : 'Ocurrió un problema al buscar el cliente'
      : undefined,
    isLoading: !data && !error
  }
}
