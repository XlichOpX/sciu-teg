import { Prisma } from '@prisma/client'
import { conversionWithCurrency } from 'prisma/queries'
import { conversionCreateSchema } from 'schema/conversionSchema'
import { z } from 'zod'

export type CreateConversionInput = z.infer<typeof conversionCreateSchema>
export type ConversionWithCurrency = Prisma.ConversionGetPayload<typeof conversionWithCurrency>
