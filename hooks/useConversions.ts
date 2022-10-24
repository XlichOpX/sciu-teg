import { Conversion } from '@prisma/client'
import useSWR from 'swr'
import { calcPages } from 'utils/calcPages'
import { usePagination } from './usePagination'

export const useConversions = ({ itemsPerPage = 20 } = {}) => {
  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })
  const { data, error } = useSWR<{ count: number; result: Conversion[] }, Error>(
    `/api/conversion?offset=${offset}&limit=${limit}`
  )
  return {
    conversions: data?.result,
    latestConversion: data?.result[0],
    error,
    setPage,
    page,
    pages: data?.count && calcPages(data.count, itemsPerPage)
  }
}

export const conversionKeysMatcher = '^/api/conversion*'
