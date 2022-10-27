import { Currency } from '@prisma/client'
import useSWR from 'swr'

export const useCurrencies = () => {
  const { data, error } = useSWR<Currency[], Error>('/api/currency')
  return { currencies: data, error, isLoading: !data && !error }
}

export const currencyKeysMatcher = '^/api/currency*'
