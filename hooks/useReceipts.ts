import useSWR from 'swr'
import { usePagination } from './usePagination'

export const useReceipts = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })
  const { data, error } = useSWR<{ count: number; result: any[] }, Error>(
    `/api/receipt?offset=${offset}&limit=${limit}`
  )
  return {
    receipts: data?.result,
    count: data?.count,
    error,
    isLoading: !data && !error,
    page,
    pages: data?.count && Math.ceil(data.count / itemsPerPage),
    setPage
  }
}
