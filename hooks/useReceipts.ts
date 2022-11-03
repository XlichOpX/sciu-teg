import { useState } from 'react'
import useSWR from 'swr'
import { GetReceiptWithPersonResponse } from 'types/receipt'
import { calcPages } from 'utils/calcPages'
import { usePagination } from './usePagination'

export const useReceipts = ({
  itemsPerPage,
  initialSearch = '',
  savePage = true
}: {
  itemsPerPage: number
  initialSearch?: string
  savePage?: boolean
}) => {
  const [search, setSearchState] = useState(initialSearch)
  const { page, offset, limit, setPage } = usePagination({ itemsPerPage, savePage })
  const { data, error } = useSWR<GetReceiptWithPersonResponse, Error>(
    `/api/receipt?offset=${offset}&limit=${limit}&keyword=${search}`
  )

  return {
    receipts: data?.result,
    count: data?.count,
    error,
    isLoading: !data && !error,
    page,
    pages: data?.count && calcPages(data.count, itemsPerPage),
    setPage,
    setSearch: (search: string) => {
      setSearchState(search)
      setPage(1)
    }
  }
}
