import { sheetSchema } from 'schema/batchImportSchema'
import { z } from 'zod'

export type RowData = { [x: string]: string | number }
export type RawRowData = (string | number)[]
export type DataMatriz = (string | number)[][]

export type Sheet = { headings: unknown[]; data: unknown[][] }
export type SheetData = z.infer<typeof sheetSchema>
export type FormattedErrors = z.inferFormattedError<SheetData>

export type rowSheet = {
  cedula: string
  semestre: string | null
  mensualidad: string | null
  producto: string
  precio: number
  cantidad: number
  metodo_de_pago: string
  moneda: number
  monto_cobrado: number
  referencia: string
  fecha: Date
}
