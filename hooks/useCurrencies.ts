import { Currency } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'

export const useCurrencies = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Currency[], Error>('/api/currency')

  return {
    currencies: data?.filter((c) => (c.name + c.symbol).toLocaleLowerCase().includes(search)),
    error,
    isLoading: !data && !error,
    search,
    setSearch
  }
}

export const currencyKeysMatcher = '^/api/currency*'
