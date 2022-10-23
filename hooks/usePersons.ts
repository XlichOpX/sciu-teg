import useSWR from 'swr'
import { PersonListing } from 'types/person'

export const usePersons = () => {
  const { data, error } = useSWR<{ count: number; result: PersonListing[] }, Error>('/api/person')
  const selectOptions = data?.result.map((p) => ({
    value: p.id,
    label: p.firstName + ' ' + p.firstLastName
  }))

  return {
    persons: data,
    error,
    selectOptions,
    count: data?.count
  }
}

export const personKeysMatcher = '^/api/person*'
