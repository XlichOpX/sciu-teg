import useSWR from 'swr'
import { ReceiptWithAll } from 'types/receipt'

export const useReceipt = (receiptId?: number) => {
  const { data, error } = useSWR<ReceiptWithAll, Error>(
    receiptId ? `/api/receipt/${receiptId}` : null
  )
  return { receipt: data, error }
}
