import { Alert, Button, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import { AddProductModal, ChargeSelectionModal, ReceivablesForm } from 'components/charges'
import { ClientInfo, CommunityLayout, CreateClientModal } from 'components/community'
import { useAuth, useClient } from 'hooks'
import { useReceivables } from 'hooks/charges'
import Head from 'next/head'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { FaGraduationCap } from 'react-icons/fa'

const CommunityDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const clientId = (router.query.docNum as string) ?? ''
  const { client, errorMsg, error, isLoading } = useClient(clientId)
  const { user } = useAuth()

  const clientNotFound = error?.statusCode === 404
  const isStudent = error?.statusCode === 409

  const { products, isEmpty, addProduct, removeProduct, resetProducts } = useReceivables()

  if (!user) return null

  return (
    <>
      <Head>{clientId && <title>{`Comunidad | ${clientId}`}</title>}</Head>

      {errorMsg && (
        <Alert mb={4} status="error">
          {errorMsg}
        </Alert>
      )}

      {clientNotFound && user.permissions.includes('CREATE_CLIENT') && <CreateClientModal />}
      {isStudent && (
        <NLink href={`/estudiantes/${clientId}`} passHref>
          <Button as="a" colorScheme="blue" leftIcon={<FaGraduationCap />}>
            Ir al estudiante
          </Button>
        </NLink>
      )}

      {isLoading && <FullyCenteredSpinner />}

      {client && (
        <>
          <ClientInfo client={client} />

          {isEmpty && <Alert>Agregue los productos a cobrar...</Alert>}
          {!isEmpty && <ReceivablesForm onProductRemove={removeProduct} products={products} />}

          <Flex justifyContent="space-between" mt={4} gap={4} wrap="wrap">
            <AddProductModal width={{ base: 'full', sm: 'auto' }} onSubmit={addProduct} />

            <ChargeSelectionModal
              width={{ base: 'full', sm: 'auto' }}
              products={products}
              disabled={products.length === 0}
              personId={client.person.id}
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
