import { Heading } from '@chakra-ui/react'
import { BaseLayout } from 'components'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const PaymentMethodsSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">Métodos de pago</Heading>
    </>
  )
}

PaymentMethodsSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default PaymentMethodsSettings
