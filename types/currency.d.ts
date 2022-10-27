import { Currency } from '@prisma/client'
import { createCurrencySchema } from 'schema/currencySchema'
import { z } from 'zod'

export type Currency = Currency
export type CreateCurrencyInput = z.infer<typeof createCurrencySchema>
export type UpdateCurrencyInput = CreateCurrencyInput
