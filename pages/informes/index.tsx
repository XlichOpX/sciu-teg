import { Divider, Heading, Text } from '@chakra-ui/react'
import { BaseLayout, SidebarLayout } from 'components/layouts'
import { Sidebar } from 'components/reports'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { useState } from 'react'
import { getReport } from 'services/reports'
import { Report } from 'types/report'

const Reports: NextPageWithLayout = () => {
  const [report, setReport] = useState<Report>()
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
              setReport(report)
            }}
          />
        }
        sidebarWidth="30%"
      >
        {!report && <Text>Solicite un informe...</Text>}
        {report && <pre>{JSON.stringify(report, null, 2)}</pre>}
      </SidebarLayout>
    </>
  )
}

Reports.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Reports
