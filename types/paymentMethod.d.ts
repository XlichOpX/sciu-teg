import { Prisma } from '@prisma/client'
import { paymentMethodWithConversion } from 'prisma/queries'
import { paymentMethodSchema } from 'schema/paymentMethodSchema'
import { z } from 'zod'

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>
export type PaymentMethodWithConversion = Prisma.PaymentMethodGetPayload<
  typeof paymentMethodWithConversion
>
