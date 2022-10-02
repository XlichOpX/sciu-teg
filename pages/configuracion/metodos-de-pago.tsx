import { Divider, Flex } from '@chakra-ui/react'
import { Pagination, SearchInput } from 'components'
import { Layout } from 'components/settings'
import CreatePaymentMethodModal from 'components/settings/payment-methods/CreatePaymentMethodModal'
import PaymentMethodsList from 'components/settings/payment-methods/PaymentMethodsList'
import { NextPageWithLayout } from 'pages/_app'

const PaymentMethodsSettings: NextPageWithLayout = () => {
  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar métodos de pago" />
        <CreatePaymentMethodModal />
      </Flex>
      <Divider my={4} />

      <PaymentMethodsList />

      <Pagination />
    </>
  )
}

PaymentMethodsSettings.getLayout = (page) => <Layout title="Métodos de pago">{page}</Layout>

export default PaymentMethodsSettings
