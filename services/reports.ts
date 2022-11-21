import { ReportTypeKey } from 'components/reports'
import { fetch } from 'lib/fetch'

export const getReport = async ({
  reportType,
  start,
  end,
  filters
}: {
  reportType: ReportTypeKey
  start: string
  end: string
  filters: Record<string, number[]>
}) => {
  const filtersParams = Object.keys(filters)
    .map((f) => filters[f].map((val) => `&${f}=${val}`))
    .flat()
    .join('')

  switch (reportType) {
    case 'arqByCategory':
      return await fetch(
        `/api/reports?report=arqByCategory&start=${start}&end=${end}${filtersParams}`
      )

    case 'arqByPayMethod':
      return await fetch(
        `/api/reports?report=arqByPayMethod&start=${start}&end=${end}${filtersParams}`
      )
  }
}
