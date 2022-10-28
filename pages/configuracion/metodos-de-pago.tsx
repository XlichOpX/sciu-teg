import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreatePaymentMethodModal, PaymentMethodsList } from 'components/settings/payment-methods'
import { usePaymentMethods } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const PaymentMethodsSettings: NextPageWithLayout = () => {
  const { paymentMethods, setSearch, createPaymentMethod, error, isLoading } = usePaymentMethods()

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput
          placeholder="Buscar métodos de pago"
          onChange={({ text }) => {
            setSearch(text)
          }}
        />
        <CreatePaymentMethodModal onSubmit={createPaymentMethod} />
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
