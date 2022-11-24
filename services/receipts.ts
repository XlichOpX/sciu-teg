import { Receipt } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { CreateReceiptInput } from 'types/receipt'

export const createReceipt = async (data: CreateReceiptInput) => {
  return (await fetch('/api/receipt', { method: 'POST', body: data })) as Receipt
}

export const sendReceiptsByEmail = async (receiptIDs: number[]) => {
  return await fetch('/api/receipt/toPdf', {
    method: 'POST',
    body: { receipts: receiptIDs }
  })
}
