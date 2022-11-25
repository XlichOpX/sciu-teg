import { Alert, Box, Button, Divider, Heading, Text, VStack } from '@chakra-ui/react'
import { Chart } from 'chart.js'
import autocolors from 'chartjs-plugin-autocolors'
import { FullyCenteredSpinner } from 'components/app'
import { BaseLayout, SidebarLayout } from 'components/layouts'
import { Sidebar } from 'components/reports'
import { ReportTypeKey, reportTypes } from 'components/reports/reportTypes'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { useState } from 'react'
import { BsPrinterFill } from 'react-icons/bs'
import { getReport } from 'services/reports'
import { Report } from 'types/report'
import { hideOnPrint } from 'utils/hideOnPrint'

Chart.register(autocolors)

const Reports: NextPageWithLayout = () => {
  const [report, setReport] = useState<{
    type: ReportTypeKey
    data: Report
    start: string
    end: string
  }>()
  const [isLoading, setIsLoading] = useState(false)

  const ReportView = report ? reportTypes[report.type].component : undefined

  const isOneDay = report?.start === report?.end

  return (
    <>
      <Box sx={{ ...hideOnPrint }}>
        <Head>
          <title>Informes</title>
        </Head>
        <Heading as="h1">Informes</Heading>
        <Divider my={4} />
      </Box>

      <SidebarLayout
        sidebar={
          <Sidebar
            isLoading={isLoading}
            sx={{ ...hideOnPrint }}
            onSubmit={async (data) => {
              setIsLoading(true)
              const report = await getReport(data)
              const { reportType, start, end } = data
              setReport({
                type: reportType,
                data: report,
                start: start.replaceAll('-', '/'),
                end: end.replaceAll('-', '/')
              })
              setIsLoading(false)
            }}
          />
        }
        sidebarWidth="30%"
      >
        {!report && <Text>Solicite un informe...</Text>}
        {isLoading && <FullyCenteredSpinner />}

        {report && ReportView && !isLoading && (
          <>
            <VStack mb={3}>
              <Heading size="lg">{reportTypes[report.type].label}</Heading>
              <span>{isOneDay ? report.start : `${report.start} - ${report.end}`}</span>
              <Divider />
            </VStack>

            {report.data.length > 0 || Object.keys(report.data).length > 0 ? (
              <ReportView data={report.data} />
            ) : (
              <Alert>Sin movimientos...</Alert>
            )}

            <Button
              mx="auto"
              my={3}
              display="block"
              colorScheme="blue"
              leftIcon={<BsPrinterFill />}
              onClick={print}
              sx={{ ...hideOnPrint }}
            >
              Imprimir
            </Button>
          </>
        )}

        {report && !ReportView && !isLoading && <pre>{JSON.stringify(report, null, 2)}</pre>}
      </SidebarLayout>
    </>
  )
}

Reports.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Reports
