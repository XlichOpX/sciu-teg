import useSWR from 'swr'

export const useReceipt = (receiptId?: number) => {
  const { data, error } = useSWR<Record<string, any>, Error>(
    receiptId ? `/api/receipt/${receiptId}` : null
  )
  return { receipt: data, error }
}
