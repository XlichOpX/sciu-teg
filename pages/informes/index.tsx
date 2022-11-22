import { Divider, Heading, Text } from '@chakra-ui/react'
import { BaseLayout, SidebarLayout } from 'components/layouts'
import { Sidebar } from 'components/reports'
import { ReportTypeKey, reportTypes } from 'components/reports/reportTypes'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { useState } from 'react'
import { getReport } from 'services/reports'
import { Report } from 'types/report'

const Reports: NextPageWithLayout = () => {
  const [report, setReport] = useState<{ type: ReportTypeKey; data: Report }>()
  const ReportView = report ? reportTypes[report.type].component : undefined

  return (
    <>
      <Head>
        <title>Informes</title>
      </Head>

      <Heading as="h1">Informes</Heading>
      <Divider my={4} />

      <SidebarLayout
        sidebar={
          <Sidebar
            onSubmit={async (data) => {
              const report = await getReport(data)
              setReport({ type: data.reportType, data: report })
            }}
          />
        }
        sidebarWidth="30%"
      >
        {!report && <Text>Solicite un informe...</Text>}
        {report && ReportView ? (
          <ReportView data={report.data} />
        ) : (
          <pre>{JSON.stringify(report, null, 2)}</pre>
        )}
      </SidebarLayout>
    </>
  )
}

Reports.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Reports
