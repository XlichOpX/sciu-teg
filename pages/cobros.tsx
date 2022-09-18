import { Flex } from '@chakra-ui/react'
import { BaseLayout, HeadingWithSearch } from 'components'
import { ChargeSelectionModal, MonthlyPayments, StudentInfo } from 'components/charges'
import AddProductsModal from 'components/charges/AddProductsModal'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

const Charges: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Cobros</title>
      </Head>

      <HeadingWithSearch title="Cobros" placeholder="Cédula" />

      <StudentInfo />

      <MonthlyPayments />

      <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
        <AddProductsModal width={{ base: 'full', sm: 'auto' }} />
        <ChargeSelectionModal width={{ base: 'full', sm: 'auto' }} />
      </Flex>
    </>
  )
}

Charges.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Charges
