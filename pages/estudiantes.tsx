import { Alert, Flex } from '@chakra-ui/react'
import { HeadingWithSearch } from 'components/app'
import {
  AddProductModal,
  BillignsFormData,
  BillingsForm,
  ChargeSelectionModal,
  StudentInfo
} from 'components/charges'
import { BaseLayout } from 'components/layouts'
import { useBillings } from 'hooks'
import Head from 'next/head'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NextPageWithLayout } from './_app'

const Charges: NextPageWithLayout = () => {
  const [docNumber, setDocNumber] = useState('')
  const { data, error } = useBillings(docNumber)

  const billingsFormHook = useForm<BillignsFormData>({
    defaultValues: { billings: [] }
  })
  const selectedBillingsIDs = billingsFormHook.watch('billings')

  return (
    <>
      <Head>
        <title>Estudiantes</title>
      </Head>

      <HeadingWithSearch
        title="Estudiantes"
        placeholder="Cédula"
        onSubmit={({ text }) => {
          billingsFormHook.reset()
          setDocNumber(text)
        }}
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

          {data.billings.length > 0 && (
            <BillingsForm billings={data.billings} formHook={billingsFormHook} />
          )}
          {data.billings.length === 0 && <Alert>El estudiante no posee deudas por pagar.</Alert>}

          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductModal
              width={{ base: 'full', sm: 'auto' }}
              onSubmit={(data) => console.log(data)}
            />
            <ChargeSelectionModal
              width={{ base: 'full', sm: 'auto' }}
              selectedBillings={data.billings.filter((b) => selectedBillingsIDs.includes(b.id))}
              disabled={selectedBillingsIDs.length === 0}
              personId={data.student.person.id}
            />
          </Flex>
        </>
      )}
    </>
  )
}

Charges.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Charges
