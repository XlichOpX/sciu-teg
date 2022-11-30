import useSWR from 'swr'
import { ConversionWithCurrency } from 'types/conversion'
import { calcPages } from 'utils/calcPages'
import { usePagination } from './usePagination'

export const useConversions = ({ itemsPerPage = 20 } = {}) => {
  const { page, offset, limit, setPage } = usePagination({ itemsPerPage })
  const { data, error } = useSWR<{ count: number; result: ConversionWithCurrency[] }, Error>(
    `/api/conversion?offset=${offset}&limit=${limit}`
  )
  return {
    conversions: data?.result,
    latestConversion: data?.result[0],
    error,
    setPage,
    page,
    pages: data?.count && calcPages(data.count, itemsPerPage),
    isLoading: !data && !error
  }
}

export const conversionKeysMatcher = '^/api/conversion*'
