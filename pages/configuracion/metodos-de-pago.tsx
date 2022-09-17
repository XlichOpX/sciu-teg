import { Heading } from '@chakra-ui/react'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const PaymentMethodsSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">Métodos de pago</Heading>
    </>
  )
}

PaymentMethodsSettings.getLayout = (page) => <Layout title="Métodos de pago">{page}</Layout>

export default PaymentMethodsSettings
