import { ReportTypeKey } from 'components/reports/reportTypes'
import { fetch } from 'lib/fetch'
import { CategoryReport } from 'types/category'
import { PaymentMethodReport } from 'types/paymentMethod'

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
    case 'arqByCategory':
      return (await fetch(
        `/api/reports?report=arqByCategory&start=${start}&end=${end}${filtersParams}`
      )) as CategoryReport

    case 'arqByPayMethod':
      return (await fetch(
        `/api/reports?report=arqByPayMethod&start=${start}&end=${end}${filtersParams}`
      )) as PaymentMethodReport
  }
}
