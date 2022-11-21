import { z } from 'zod'
import { ArqByCategoryFilters } from './ArqByCategoryFilters'
import { ArqByPayMethodFilters } from './ArqByPayMethodFilters'

export const reportTypes = {
  arqByCategory: {
    label: 'Arqueo por categoría',
    schema: z.object({ category: z.number().array() }),
    defaultValues: { category: [] },
    filters: ArqByCategoryFilters
  },
  arqByPayMethod: {
    label: 'Arqueo por método de pago',
    schema: z.object({ paymentMethod: z.number().array() }),
    defaultValues: { paymentMethod: [] },
    filters: ArqByPayMethodFilters
  }
}

export type ReportType = typeof reportTypes
export type ReportTypeKey = keyof typeof reportTypes
