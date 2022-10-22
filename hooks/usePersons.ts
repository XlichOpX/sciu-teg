import { Person } from '@prisma/client'
import useSWR from 'swr'

export const usePersons = () => {
  const { data, error } = useSWR<Person[], Error>('/api/person')
  const selectOptions = data?.map((p) => ({
    value: p.id,
    label: p.firstName + ' ' + p.firstLastName
  }))

  return {
    persons: data,
    error,
    selectOptions
  }
}

export const personKeysMatcher = '^/api/person*'
