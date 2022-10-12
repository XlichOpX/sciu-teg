import { Divider } from '@chakra-ui/react'
import { Pagination } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { ExchangeRatesList, UpdateExchangeRateModal } from 'components/settings/exchange-rates'
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
  <SettingsLayout title="Tasas de cambio">{page}</SettingsLayout>
)

export default ExchangeRatesSettings
