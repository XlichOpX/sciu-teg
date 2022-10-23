import { Alert, Flex } from '@chakra-ui/react'
import { HeadingWithSearch } from 'components/app'
import {
  AddProductsModal,
  BillingsForm,
  ChargeSelectionModal,
  StudentInfo
} from 'components/charges'
import { BaseLayout } from 'components/layouts'
import { useBillings } from 'hooks'
import Head from 'next/head'
import { useState } from 'react'
import { NextPageWithLayout } from './_app'

const Charges: NextPageWithLayout = () => {
  const [docNumber, setDocNumber] = useState('')
  const { data, error } = useBillings(docNumber)

  return (
    <>
      <Head>
        <title>Cobros</title>
      </Head>

      <HeadingWithSearch
        title="Cobros"
        placeholder="Cédula"
        onSubmit={({ text }) => setDocNumber(text)}
      />

      {error && (
        <Alert mb={4} status="error">
          {error.message}
        </Alert>
      )}

      {!data && <Alert>Busque un estudiante por su cédula...</Alert>}

      {data && (
        <>
          <StudentInfo student={data.student} />

          <BillingsForm billings={data.billings} />

          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductsModal width={{ base: 'full', sm: 'auto' }} />
            <ChargeSelectionModal width={{ base: 'full', sm: 'auto' }} />
          </Flex>
        </>
      )}
    </>
  )
}

Charges.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Charges
