import { Prisma } from '@prisma/client'
import { paymentMethodWithConversion } from 'prisma/queries'
import { metaPaymentSchema, paymentMethodInputSchema } from 'schema/paymentMethodSchema'
import { z } from 'zod'

export type PaymentMethodInput = z.infer<typeof paymentMethodInputSchema>
export type PaymentMethodWithConversion = Prisma.PaymentMethodGetPayload<
  typeof paymentMethodWithConversion
>
export type MetaPayment = z.infer<typeof metaPaymentSchema>
