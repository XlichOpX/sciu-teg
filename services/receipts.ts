import { fetch } from 'lib/fetch'
import { CreateReceiptInput } from 'types/receipt'

export const createReceipt = async (data: CreateReceiptInput) => {
  return await fetch('/api/receipts', { method: 'POST', body: data })
}
