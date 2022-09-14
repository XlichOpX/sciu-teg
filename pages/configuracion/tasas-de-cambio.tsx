import { Heading } from '@chakra-ui/react'
import { BaseLayout } from 'components'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const ExchangeRatesSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">Tasas de cambio</Heading>
    </>
  )
}

ExchangeRatesSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default ExchangeRatesSettings
