import { Prisma } from '@prisma/client'
import { paymentMethodWithConversion } from 'prisma/queries'
import {
  metaPaymentDataSchema,
  metaPaymentDefSchema,
  paymentMethodInputSchema
} from 'schema/paymentMethodSchema'
import { z } from 'zod'

export type PaymentMethodInput = z.infer<typeof paymentMethodInputSchema>
export type PaymentMethodWithConversion = Omit<
  Prisma.PaymentMethodGetPayload<typeof paymentMethodWithConversion>,
  'metaPayment'
> & { metaPayment: MetaPaymentDef[] }

export type MetaPaymentDef = z.infer<typeof metaPaymentDefSchema>
export type MetaPaymentData = z.infer<typeof metaPaymentDataSchema>
