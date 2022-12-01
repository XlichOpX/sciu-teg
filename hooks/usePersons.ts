import { useState } from 'react'
import useSWR from 'swr'
import { PersonListing } from 'types/person'
import { usePagination } from './usePagination'

export const usePersons = () => {
  const { offset, limit } = usePagination({ itemsPerPage: 5 })
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<{ count: number; result: PersonListing[] }, Error>(
    `/api/person?offset=${offset}&limit=${limit}${search ? `&keyword=${search}` : ''}`
  )

  const selectOptions = data?.result.map((p) => ({
    value: p.id,
    label: [
      p.firstName,
      p.middleName,
      p.firstLastName,
      p.secondLastName,
      `- ${p.docType.type}:`,
      p.docNumber
    ].join(' ')
  }))

  return {
    persons: data,
    error,
    selectOptions,
    count: data?.count,
    setSearch,
    isLoading: !data && !error
  }
}

export const personKeysMatcher = '^/api/person*'
