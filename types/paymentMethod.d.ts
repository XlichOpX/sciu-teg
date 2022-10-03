import { paymentMethodSchema } from 'schema/paymentMethodSchema'
import { z } from 'zod'

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>
