import { Currency } from '@prisma/client'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export const useCurrencies = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<Currency[], Error>('/api/currency')

  const currencies = useMemo(
    () => data?.filter((c) => (c.name + c.symbol).toLocaleLowerCase().includes(search)),
    [data, search]
  )

  return {
    currencies,
    error,
    isLoading: !data && !error,
    search,
    setSearch
  }
}

export const currencyKeysMatcher = '^/api/currency*'
