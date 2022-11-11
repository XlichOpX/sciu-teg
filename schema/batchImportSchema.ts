import { z } from 'zod'

/** Intenta convertir el input a string antes de validarlo como tal */
export const castToString = z.preprocess(
  (arg) => (typeof arg !== 'undefined' ? String(arg) : arg),
  z.string()
)

export const headingSchema = z.tuple([
  z.literal('cedula'),
  z.literal('semestre'),
  z.literal('mensualidad'),
  z.literal('producto'),
  z.literal('precio'),
  z.literal('cantidad'),
  z.literal('metodo_de_pago'),
  z.literal('monto_cobrado'),
  z.literal('referencia'),
  z.literal('fecha')
])

export const dataSchema = z
  .tuple([
    castToString,
    castToString.nullable(),
    z.string().nullable(),
    z.string(),
    z.number().positive(),
    z.number().positive().int(),
    z.string(),
    z.number().positive(),
    castToString,
    z.date()
  ])
  .array()

export const sheetSchema = z.object({
  headings: headingSchema,
  data: dataSchema
})
