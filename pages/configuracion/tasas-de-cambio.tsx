import { Divider } from '@chakra-ui/react'
import { BaseLayout, Pagination } from 'components'
import { Layout } from 'components/settings'
import ExchangeRatesList from 'components/settings/exchange-rates/ExchangeRatesList'
import UpdateExchangeRateModal from 'components/settings/exchange-rates/UpdateExchangeRateModal'
import { NextPageWithLayout } from 'pages/_app'

const ExchangeRatesSettings: NextPageWithLayout = () => {
  return (
    <>
      <UpdateExchangeRateModal />
      <Divider my={4} />

      <ExchangeRatesList />

      <Pagination />
    </>
  )
}

ExchangeRatesSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default ExchangeRatesSettings
