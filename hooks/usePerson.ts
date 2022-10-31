import useSWR from 'swr'
import { PersonWithAll } from 'types/person'

export const usePerson = (docNum: string) => {
  const { data, error } = useSWR<PersonWithAll, Error>(`/api/person/${docNum}`)

  return {
    person: data,
    error,
    isLoading: !data && !error
  }
}
