import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreatePaymentMethodModal, PaymentMethodsList } from 'components/settings/payment-methods'
import { useAuth, usePaymentMethods } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const PaymentMethodsSettings: NextPageWithLayout = () => {
  const { paymentMethods, setSearch, error, isLoading } = usePaymentMethods()

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_PAYMENTMETHOD')) {
    return <Alert status="error">No tiene permiso para ver los métodos de pago</Alert>
  }

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput
          placeholder="Buscar métodos de pago"
          onChange={({ text }) => {
            setSearch(text)
          }}
        />
        {user?.permissions.includes('CREATE_PAYMENTMETHOD') && <CreatePaymentMethodModal />}
      </Flex>
      <Divider my={4} />

      {error && (
        <Alert status="error" mb={3}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <PaymentMethodsList>
        {paymentMethods?.map((pm) => (
          <PaymentMethodsList.Item key={pm.id} paymentMethod={pm} />
        ))}
      </PaymentMethodsList>
    </>
  )
}

PaymentMethodsSettings.getLayout = (page) => (
  <SettingsLayout title="Métodos de pago">{page}</SettingsLayout>
)

export default PaymentMethodsSettings
