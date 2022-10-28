import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Career } from 'types/career'

export const useCareers = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Career[], Error>('/api/career')

  const careers = useMemo(
    () => data?.filter((c) => c.career.toLocaleLowerCase().includes(search)),
    [data, search]
  )

  return {
    careers,
    error,
    isLoading: !data && !error,
    search,
    setSearch
  }
}

export const careerKeysMatcher = '^/api/career*'
