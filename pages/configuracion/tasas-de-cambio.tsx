import { Alert, Divider } from '@chakra-ui/react'
import { Pagination } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { ExchangeRatesList, UpdateExchangeRateModal } from 'components/settings/exchange-rates'
import { useConversions } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const ExchangeRatesSettings: NextPageWithLayout = () => {
  const { conversions, error, page, pages, setPage } = useConversions({ itemsPerPage: 21 })
  return (
    <>
      <UpdateExchangeRateModal />
      <Divider my={4} />

      <ExchangeRatesList>
        {conversions?.map((c) => (
          <ExchangeRatesList.Item key={c.id} conversion={c} />
        ))}
      </ExchangeRatesList>

      {conversions && <Pagination page={page} pages={pages} setPage={setPage} />}

      {error && (
        <Alert status="error" my={4}>
          {error.message}
        </Alert>
      )}
    </>
  )
}

ExchangeRatesSettings.getLayout = (page) => (
  <SettingsLayout title="Tasas de cambio">{page}</SettingsLayout>
)

export default ExchangeRatesSettings
