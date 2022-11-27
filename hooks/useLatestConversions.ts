import { getLatestConversions } from 'services/conversions'
import useSWR from 'swr'

export const useLatestConversions = () => {
  const { data, error } = useSWR('/api/conversion/latest', getLatestConversions)

  return {
    latestConversions: data,
    error,
    isLoading: !data && !error
  }
}
