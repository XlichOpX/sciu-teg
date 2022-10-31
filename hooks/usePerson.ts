import { HttpError } from 'lib/http-error'
import useSWR from 'swr'
import { PersonWithAll } from 'types/person'

export const usePerson = (docNum?: string) => {
  const { data, error } = useSWR<PersonWithAll, HttpError>(docNum ? `/api/person/${docNum}` : null)

  return {
    person: data,
    error,
    isLoading: !data && !error
  }
}
