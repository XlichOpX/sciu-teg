import { Prisma } from '@prisma/client'
import { paymentMethodWithConversion } from 'prisma/queries'
import {
  metaPaymentDataSchema,
  metaPaymentDefSchema,
  paymentMethodCreateSchema,
  paymentMethodUpdateSchema
} from 'schema/paymentMethodSchema'
import { z } from 'zod'

export type PaymentMethodCreateInput = z.infer<typeof paymentMethodCreateSchema>
export type PaymentMethodUpdateInput = z.infer<typeof paymentMethodUpdateSchema>
export type PaymentMethodWithConversion = Omit<
  Prisma.PaymentMethodGetPayload<typeof paymentMethodWithConversion>,
  'metaPayment'
> & { metaPayment: MetaPaymentDef[] | undefined }

export type MetaPaymentDef = z.infer<typeof metaPaymentDefSchema>
export type MetaPaymentData = z.infer<typeof metaPaymentDataSchema>
