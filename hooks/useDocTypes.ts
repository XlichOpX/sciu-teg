import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { DocType } from 'types/doctype'

export const useDocTypes = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<DocType[], Error>('/api/docType')

  const docTypes = useMemo(
    () => data?.filter((dt) => dt.type.toLocaleLowerCase().includes(search)),
    [data, search]
  )

  return {
    docTypes,
    error,
    isLoading: !data && !error,
    search,
    setSearch
  }
}

export const doctypeKeysMatcher = '^/api/docType*'
