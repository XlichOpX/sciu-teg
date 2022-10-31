import { Alert, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import {
  AddProductFormSubmitHandler,
  AddProductModal,
  BillingsForm,
  BillingsFormData,
  ChargeSelectionModal,
  ProductReceivable,
  StudentInfo
} from 'components/charges'
import { StudentsLayout } from 'components/students'
import { useBillings } from 'hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const StudentDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const docNumber = router.query.docNum as string

  const { data, error, isLoading, mutate } = useBillings(docNumber)

  const billingsFormHook = useForm<BillingsFormData>({
    defaultValues: { billings: [] }
  })

  const selectedBillingsIDs = billingsFormHook.watch('billings')
  const [products, setProducts] = useState<ProductReceivable[]>([])

  const onProductAdd: AddProductFormSubmitHandler = (product) => {
    const existentProductIndex = products.findIndex((p) => p.id === product.id)
    const isExistentProduct = existentProductIndex >= 0
    // Si el producto ya estaba, lo reemplazamos
    if (isExistentProduct) {
      setProducts([
        ...products.slice(0, existentProductIndex),
        product,
        ...products.slice(existentProductIndex + 1)
      ])
    } else {
      setProducts([...products, product])
    }
  }

  const onProductRemove = (productId: number) =>
    setProducts(products.filter((p) => p.id !== productId))

  return (
    <>
      <Head>{docNumber && <title>{`Estudiantes | ${docNumber}`}</title>}</Head>

      {error && (
        <Alert mb={4} status="error">
          {error.message}
        </Alert>
      )}

      {isLoading && <FullyCenteredSpinner />}

      {data && (
        <>
          <StudentInfo student={data.student} />

          <BillingsForm
            onProductRemove={onProductRemove}
            products={products}
            billings={data.billings}
            formHook={billingsFormHook}
          />

          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductModal width={{ base: 'full', sm: 'auto' }} onSubmit={onProductAdd} />
            <ChargeSelectionModal
              width={{ base: 'full', sm: 'auto' }}
              billings={data.billings.filter((b) => selectedBillingsIDs.includes(b.id))}
              products={products}
              disabled={selectedBillingsIDs.length === 0 && products.length === 0}
              personId={data.student.person.id}
              onRecord={async () => {
                billingsFormHook.reset()
                setProducts([])
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
