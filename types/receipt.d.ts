import { Prisma } from '@prisma/client'
import { receiptWithAll, receiptWithPerson } from 'prisma/queries'

export type ReceiptWithPerson = Prisma.ReceiptGetPayload<typeof receiptWithPerson>
export type GetReceiptWithPersonResponse = { count: number; result: ReceiptWithPerson[] }
export type ReceiptWithAll = Prisma.ReceiptGetPayload<typeof receiptWithAll>
