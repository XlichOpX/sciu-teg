import { Divider, Heading, Text } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import { SoldProductsGraph } from 'components/reports/SoldProductsGraph'
import dayjs from 'lib/dayjs'
import { getReport } from 'services/reports'
import useSWR from 'swr'
import { ProductReport } from 'types/report'
import { toDateInputString } from 'utils/toDateInputString'

export const MonthlySoldProducts = () => {
  const start = dayjs().date(1)
  const end = dayjs()

  const { data, error } = useSWR(
    {
      reportType: 'soldProductsGraph',
      start: toDateInputString(start),
      end: toDateInputString(end),
      filters: {}
    },
    getReport
  )

  if (!data && !error) return <FullyCenteredSpinner />

  return (
    <>
      {data && (
        <>
          <Heading size="md" textAlign="center" mb={2}>
            Ventas del {start.format('DD-MM-YYYY')} al {end.format('DD-MM-YYYY')}
          </Heading>
          <Divider my={2} />
          <Text textAlign="center" fontWeight="medium">
            Total recaudado: $
            {(data as ProductReport[]).reduce((ac, c) => ac + c.amount, 0).toFixed(2)}
          </Text>
          <SoldProductsGraph data={data as ProductReport[]} />
        </>
      )}
    </>
  )
}
