import { z, ZodTypeAny } from 'zod'
import { ArqByCategoryFilters } from './ArqByCategoryFilters'
import { ArqByPayMethodFilters } from './ArqByPayMethodFilters'
import { ArqByPayMethodReport } from './ArqByPayMethodReport'
import { SoldProductsGraph } from './SoldProductsGraph'
import { SoldProductsReport } from './SoldProductsReport'

type ReportTypeDef = {
  label: string
  schema: ZodTypeAny
  defaultValues: Record<string, unknown>
  filters?: () => JSX.Element
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ({ data }: { data: any }) => JSX.Element
}

export const reportTypes: Record<string, ReportTypeDef> = {
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
  soldProductsGraph: {
    label: 'Gráfico de productos vendidos',
    schema: z.object({ category: z.number().array() }),
    defaultValues: { category: [] },
    filters: ArqByCategoryFilters,
    component: SoldProductsGraph
  }
}

export type ReportType = typeof reportTypes
export type ReportTypeKey = keyof typeof reportTypes
