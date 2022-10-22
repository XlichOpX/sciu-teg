import { Prisma } from '@prisma/client'
import { chargeWithPaymentMethodAndConversion } from 'prisma/queries'

export type ChargeWithPaymentMethodAndConversion = Prisma.ChargeGetPayload<
  typeof chargeWithPaymentMethodAndConversion
>
