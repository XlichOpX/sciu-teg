import { Prisma } from '@prisma/client'
import { receiptWithAll, receiptWithPerson } from 'prisma/queries'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { z } from 'zod'

export type ReceiptWithPerson = Prisma.ReceiptGetPayload<typeof receiptWithPerson>
export type GetReceiptWithPersonResponse = { count: number; result: ReceiptWithPerson[] }
export type ReceiptWithAll = Prisma.ReceiptGetPayload<typeof receiptWithAll>
export type CreateReceiptInput = z.infer<typeof receiptCreateSchemaInput>
