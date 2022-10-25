import { Alert, Flex } from '@chakra-ui/react'
import { HeadingWithSearch } from 'components/app'
import {
  AddProductFormSubmitHandler,
  AddProductModal,
  BillignsFormData,
  BillingsForm,
  ChargeSelectionModal,
  ProductReceivable,
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
              onRecord={() => {
                billingsFormHook.reset()
                setProducts([])
              }}
            />
          </Flex>
        </>
      )}
    </>
  )
}

Charges.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Charges
