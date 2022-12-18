import { ReportTypeKey } from 'components/reports/reportTypes'
import { fetch } from 'lib/fetch'
import { GroupedPaymentMethodReport, ProductReport } from 'types/report'

export const getReport = async ({
  reportType,
  start,
  end,
  filters
}: {
  reportType: ReportTypeKey
  start: string
  end: string
  filters: Record<string, unknown[]>
}) => {
  const filtersParams = Object.keys(filters)
    .map((f) => filters[f].map((val) => `&${f}=${val}`))
    .flat()
    .join('')

  switch (reportType) {
    case 'arqByPayMethod':
      return (await fetch(
        `/api/reports?report=arqByPayMethod&start=${start}&end=${end}${filtersParams}`
      )) as GroupedPaymentMethodReport

    case 'soldProductsGraph':
    case 'arqByTotalProducts':
      return (await fetch(
        `/api/reports?report=arqByTotalProducts&start=${start}&end=${end}${filtersParams}`
      )) as ProductReport[]

    default:
      throw new Error('Reporte no soportado')
  }
}
