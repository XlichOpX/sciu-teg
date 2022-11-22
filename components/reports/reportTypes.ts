import { z, ZodTypeAny } from 'zod'
import { ArqByCategoryFilters } from './ArqByCategoryFilters'
import { ArqByCategoryReport } from './ArqByCategoryReport'
import { ArqByPayMethodFilters } from './ArqByPayMethodFilters'

type ReportTypeDef = {
  label: string
  schema?: ZodTypeAny
  defaultValues?: Record<string, unknown>
  filters?: () => JSX.Element
  component?: ({ data }: { data: any }) => JSX.Element
}

export const reportTypes: Record<string, ReportTypeDef> = {
  arqByCategory: {
    label: 'Arqueo por categoría',
    schema: z.object({ category: z.number().array() }),
    defaultValues: { category: [] },
    filters: ArqByCategoryFilters,
    component: ArqByCategoryReport
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
