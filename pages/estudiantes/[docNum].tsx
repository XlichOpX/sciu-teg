import { Alert, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import {
  AddProductModal,
  ChargeSelectionModal,
  ReceivablesForm,
  ReceivablesFormData,
  StudentInfo
} from 'components/charges'
import { StudentsLayout } from 'components/students'
import { useBillings } from 'hooks'
import { useReceivables } from 'hooks/charges'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { useForm } from 'react-hook-form'

const StudentDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const docNumber = router.query.docNum as string

  const { data, errorMsg, isLoading, mutate } = useBillings(docNumber)

  const billingsFormHook = useForm<ReceivablesFormData>({
    defaultValues: { billings: [] }
  })

  const selectedBillingsIDs = billingsFormHook.watch('billings')
  const { products, addProduct, removeProduct, resetProducts } = useReceivables()

  return (
    <>
      <Head>{docNumber && <title>{`Estudiantes | ${docNumber}`}</title>}</Head>

      {errorMsg && (
        <Alert mb={4} status="error">
          {errorMsg}
        </Alert>
      )}

      {isLoading && <FullyCenteredSpinner />}

      {data && (
        <>
          <StudentInfo student={data.student} />

          <ReceivablesForm
            onProductRemove={removeProduct}
            products={products}
            billings={data.billings}
            control={billingsFormHook.control}
          />

          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductModal width={{ base: 'full', sm: 'auto' }} onSubmit={addProduct} />
            <ChargeSelectionModal
              width={{ base: 'full', sm: 'auto' }}
              billings={data.billings.filter((b) => selectedBillingsIDs.includes(b.id))}
              products={products}
              disabled={selectedBillingsIDs.length === 0 && products.length === 0}
              personId={data.student.person.id}
              onRecord={async () => {
                billingsFormHook.reset()
                resetProducts()
                await mutate()
              }}
            />
          </Flex>
        </>
      )}
    </>
  )
}

StudentDetail.getLayout = (page) => <StudentsLayout>{page}</StudentsLayout>

export default StudentDetail
