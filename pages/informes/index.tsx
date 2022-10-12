import { Divider, Heading, Text } from '@chakra-ui/react'
import { BaseLayout, SidebarLayout } from 'components/layouts'
import { Sidebar } from 'components/reports'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'

const Reports: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Informes</title>
      </Head>

      <Heading as="h1">Informes</Heading>
      <Divider my={4} />

      <SidebarLayout sidebar={<Sidebar />}>
        <Text>Solicite un informe...</Text>
      </SidebarLayout>
    </>
  )
}

Reports.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Reports
