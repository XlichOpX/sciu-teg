import { Prisma } from '@prisma/client'
import { receiptWithPerson } from 'prisma/queries'

export type ReceiptWithPerson = Prisma.ReceiptGetPayload<typeof receiptWithPerson>
export type GetReceiptWithPersonResponse = { count: number; result: ReceiptWithPerson[] }
