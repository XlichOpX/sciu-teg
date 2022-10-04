import { Currency } from '@prisma/client'
import useSWR from 'swr'

function useCurrencies() {
  const { data, error } = useSWR<Currency[], Error>('/api/currency')
  return { currencies: data, error }
}

export default useCurrencies
