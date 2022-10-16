import useSWR from 'swr'

export const useReceipts = () => {
  const { data, error } = useSWR<{ count: number; result: any[] }, Error>('/api/receipt')
  return { receipts: data?.result, count: data?.count, error, isLoading: !data && !error }
}
