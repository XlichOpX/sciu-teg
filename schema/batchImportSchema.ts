import { Currency } from '@prisma/client'
import { getCurrencies } from 'services/currencies'
import { z } from 'zod'

/** Intenta convertir el input a string antes de validarlo como tal */
export const castToString = z.preprocess((arg) => {
  if (arg != null && typeof arg !== 'string') return String(arg)
  return arg
}, z.string())

/** Intenta convertir el input a Date antes de validarlo como tal */
export const castToDate = z.preprocess((arg) => {
  if (arg != null && typeof arg === 'string') return new Date(arg)
  return arg
}, z.date())

export const headingSchema = z.tuple([
  // Estudiante
  z.literal('cedula'),
  // Producto
  // Mensualidad
  z.literal('semestre'),
  z.literal('mensualidad'),
  z.literal('producto'),
  z.literal('precio'),
  // Artículo
  z.literal('cantidad'),
  // Cobro
  z.literal('metodo_de_pago'),
  z.literal('moneda'),
  z.literal('monto_cobrado'),
  z.literal('referencia'),
  z.literal('fecha')
])

export const dataSchema = z
  .tuple([
    // Estudiante
    castToString,
    // Producto
    // Mensualidad
    castToString.nullable(),
    z.string().nullable(),
    z.string(),
    z.number().positive(),
    // Artículo
    z.number().positive().int(),
    // Cobro
    z.string(),
    z.string(),
    z.number().positive(),
    castToString,
    castToDate
  ])
  .array()
  .superRefine(async (values, ctx) => {
    let currencies: Currency[]
    if (typeof window === 'undefined') {
      const getServerSideCurrencies = (await import('utils/getServerSideCurrencies')).default
      currencies = await getServerSideCurrencies()
    } else {
      currencies = await getCurrencies()
    }

    values.forEach((val, index) => {
      const lowerCaseCurrency = val[7].toLowerCase()
      const foundCurrency = currencies.find(
        ({ name, symbol }) =>
          name.toLowerCase() === lowerCaseCurrency || symbol.toLowerCase() === lowerCaseCurrency
      )
      if (!foundCurrency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No existe la moneda "${val[7]}"`,
          path: [index, 7]
        })
      }
    })
  })

export const sheetSchema = z.object({
  headings: headingSchema,
  data: dataSchema
})
