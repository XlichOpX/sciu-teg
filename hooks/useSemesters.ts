import { useMemo, useState } from 'react'
import { getSemesters } from 'services/semesters'
import useSWR from 'swr'

export const useSemesters = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR('/api/semester', getSemesters)

  const semesters = useMemo(
    () => data?.filter((s) => s.semester.toLocaleLowerCase().includes(search)),
    [data, search]
  )

  return {
    semesters,
    error,
    isLoading: !data && !error,
    search,
    setSearch
  }
}

export const semesterKeysMatcher = '^/api/semester*'
