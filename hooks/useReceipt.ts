import useSWR from 'swr'

export const useReceipt = (receiptId: number) => {
  const { data, error } = useSWR<Record<string, any>, Error>(`/api/receipt/${receiptId}`)
  return { receipt: data, error }
}
