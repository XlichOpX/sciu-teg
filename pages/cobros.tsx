import { Alert, Flex } from '@chakra-ui/react'
import { BaseLayout, HeadingWithSearch } from 'components'
import { ChargeSelectionModal, Items, StudentInfo } from 'components/charges'
import AddProductsModal from 'components/charges/AddProductsModal'
import useBillings from 'hooks/useBillings'
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

      {data && (
        <>
          <StudentInfo
            name={`${data.student.person.firstName} ${data.student.person.firstLastName}`}
            docNumber={data.student.person.docNumber}
            career={data.student.career.career}
            status={data.student.status.status}
          />
          <Items billings={data.billings} />
          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductsModal width={{ base: 'full', sm: 'auto' }} />
            <ChargeSelectionModal width={{ base: 'full', sm: 'auto' }} />
          </Flex>
        </>
      )}

      {error && (
        <Alert mb={4} status="error">
          {error.message}
        </Alert>
      )}

      {!data && <Alert>Busque un estudiante por su cédula...</Alert>}
    </>
  )
}

Charges.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Charges
