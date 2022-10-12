import { Divider } from '@chakra-ui/react'
import { Pagination } from 'components/app'
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

ExchangeRatesSettings.getLayout = (page) => <Layout title="Tasas de cambio">{page}</Layout>

export default ExchangeRatesSettings
