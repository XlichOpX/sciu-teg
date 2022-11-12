import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateCurrencyModal, CurrencyList } from 'components/settings/currencies'
import { useAuth, useCurrencies } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const CurrencySettings: NextPageWithLayout = () => {
  const { currencies, error, isLoading, setSearch } = useCurrencies()

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_CURRENCY')) {
    return <Alert status="error">No tiene permiso para ver las monedas</Alert>
  }

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar monedas" onChange={({ text }) => setSearch(text)} />
        {user?.permissions.includes('CREATE_CURRENCY') && <CreateCurrencyModal />}
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <CurrencyList>
        {currencies?.map((r) => (
          <CurrencyList.Item key={r.id} currency={r} />
        ))}
      </CurrencyList>
    </>
  )
}

CurrencySettings.getLayout = (page) => <SettingsLayout title="Monedas">{page}</SettingsLayout>

export default CurrencySettings
