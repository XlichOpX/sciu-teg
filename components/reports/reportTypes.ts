import { z, ZodTypeAny } from 'zod'
import { ArqByCategoryFilters } from './ArqByCategoryFilters'
import { ArqByCategoryGraph } from './ArqByCategoryGraph'
import { ArqByCategoryReport } from './ArqByCategoryReport'
import { ArqByPayMethodFilters } from './ArqByPayMethodFilters'
import { ArqByPayMethodReport } from './ArqByPayMethodReport'
import { SoldProductsReport } from './SoldProductsReport'

type ReportTypeDef = {
  label: string
  schema: ZodTypeAny
  defaultValues: Record<string, unknown>
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
    filters: ArqByPayMethodFilters,
    component: ArqByPayMethodReport
  },
  arqByTotalProducts: {
    label: 'Productos vendidos por categoría',
    schema: z.object({ category: z.number().array() }),
    defaultValues: { category: [] },
    filters: ArqByCategoryFilters,
    component: SoldProductsReport
  },
  arqByCategoryGraph: {
    label: 'Gráfica de recaudos por categoría',
    schema: z.object({ category: z.number().array() }),
    defaultValues: { category: [] },
    filters: ArqByCategoryFilters,
    component: ArqByCategoryGraph
  }
}

export type ReportType = typeof reportTypes
export type ReportTypeKey = keyof typeof reportTypes
