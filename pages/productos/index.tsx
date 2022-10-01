import { Alert, Button, Divider, Flex } from '@chakra-ui/react'
import { BaseLayout, Pagination, SearchInput } from 'components'
import { Placeholder, ProductFormModal, ProductItem, ProductList } from 'components/products'
import useProducts from 'hooks/useProducts'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { createProduct, updateProduct } from 'services/products'

const Products: NextPageWithLayout = () => {
  const { products, error, isLoading, mutate } = useProducts()

  return (
    <>
      <Head>
        <title>Productos</title>
      </Head>

      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput w="auto" placeholder="Buscar productos" />
        <ProductFormModal
          trigger={<Button colorScheme="blue">Crear producto</Button>}
          onSubmit={async (data) => {
            await createProduct(data)
            await mutate()
          }}
          title="Crear producto"
          confirmText="Crear"
        />
      </Flex>
      <Divider my={4} />

      {error && <Alert status="error">{error.message}</Alert>}
      {isLoading && <Placeholder />}
      {products && (
        <>
          <ProductList>
            {products.map((p) => (
              <ProductItem
                key={p.id}
                product={p}
                onUpdate={async (data) => {
                  await updateProduct(p.id, data)
                  await mutate()
                }}
              />
            ))}
          </ProductList>
          <Divider my={4} />
          <Pagination />
        </>
      )}
    </>
  )
}

Products.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Products
