import { Currency } from '@prisma/client'
import { currencyCreateSchema, currencyUpdateSchema } from 'schema/currencySchema'
import { z } from 'zod'

export type Currency = Currency
export type CreateCurrencyInput = z.infer<typeof currencyCreateSchema>
export type UpdateCurrencyInput = z.infer<typeof currencyUpdateSchema>
