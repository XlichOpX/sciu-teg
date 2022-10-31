import { Alert, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import { AddProductModal, ChargeSelectionModal, ReceivablesForm } from 'components/charges'
import { CommunityLayout } from 'components/community'
import { PersonInfo } from 'components/community/PersonInfo'
import { usePerson } from 'hooks'
import { useReceivables } from 'hooks/charges'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'

const CommunityDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const docNumber = router.query.docNum as string
  const { person, error, isLoading } = usePerson(docNumber)

  const { products, isEmpty, addProduct, removeProduct, resetProducts } = useReceivables()

  return (
    <>
      <Head>{docNumber && <title>{`Comunidad | ${docNumber}`}</title>}</Head>

      {error && (
        <Alert mb={4} status="error">
          {error.message}
        </Alert>
      )}

      {isLoading && <FullyCenteredSpinner />}

      {person && (
        <>
          <PersonInfo person={person} />

          {isEmpty && <Alert>Agregue los productos a cobrar...</Alert>}
          {!isEmpty && <ReceivablesForm onProductRemove={removeProduct} products={products} />}

          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductModal width={{ base: 'full', sm: 'auto' }} onSubmit={addProduct} />

            <ChargeSelectionModal
              width={{ base: 'full', sm: 'auto' }}
              products={products}
              disabled={products.length === 0}
              personId={person.id}
              onRecord={async () => {
                resetProducts()
              }}
            />
          </Flex>
        </>
      )}
    </>
  )
}

CommunityDetail.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>

export default CommunityDetail
