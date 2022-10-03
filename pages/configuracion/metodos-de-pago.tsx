import { Divider, Flex } from '@chakra-ui/react'
import { SearchInput } from 'components'
import { Layout } from 'components/settings'
import CreatePaymentMethodModal from 'components/settings/payment-methods/CreatePaymentMethodModal'
import PaymentMethodsList from 'components/settings/payment-methods/PaymentMethodsList'
import usePaymentMethods from 'hooks/usePaymentMethods'
import { NextPageWithLayout } from 'pages/_app'

const PaymentMethodsSettings: NextPageWithLayout = () => {
  const { paymentMethods, setSearch } = usePaymentMethods()

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput
          placeholder="Buscar métodos de pago"
          onChange={({ text }) => {
            setSearch(text)
          }}
        />
        <CreatePaymentMethodModal />
      </Flex>
      <Divider my={4} />

      <PaymentMethodsList>
        {paymentMethods?.map((pm) => (
          <PaymentMethodsList.Item key={pm.id} paymentMethod={pm} />
        ))}
      </PaymentMethodsList>
    </>
  )
}

PaymentMethodsSettings.getLayout = (page) => <Layout title="Métodos de pago">{page}</Layout>

export default PaymentMethodsSettings
