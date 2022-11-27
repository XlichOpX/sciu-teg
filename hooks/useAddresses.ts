import { getAddresses } from 'services/addresses'
import useSWR from 'swr'

export const useAddresses = ({ search }: { search: string }) => {
  const {
    data: addresses,
    error,
    mutate
  } = useSWR(search ? `/api/address?keyword=${search}` : null, () => getAddresses(search))

  return {
    addresses,
    error,
    isLoading: !!search && !addresses && !error,
    mutate
  }
}

export const addressKeysMatcher = '^/api/address*'
