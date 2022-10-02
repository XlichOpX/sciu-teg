import { Alert, Divider, Flex, Text } from '@chakra-ui/react'
import { BaseLayout, Pagination, SearchInput } from 'components'
import { Placeholder, ProductItem, ProductList } from 'components/products'
import CreateProductModal from 'components/products/CreateProductModal'
import useProducts from 'hooks/useProducts'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { createProduct, deleteProduct, updateProduct } from 'services/products'

const Products: NextPageWithLayout = () => {
  const { products, page, pages, setPage, setSearch, error, isLoading, mutate } = useProducts({
    itemsPerPage: 20
  })

  return (
    <>
      <Head>
        <title>Productos</title>
      </Head>

      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar productos" onSubmit={(data) => setSearch(data.text)} />
        <CreateProductModal
          onSubmit={async (data) => {
            await createProduct(data)
            await mutate()
          }}
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
                onDelete={async () => {
                  await deleteProduct(p.id)
                  mutate()
                }}
              />
            ))}
          </ProductList>

          {!!pages && pages > 0 && (
            <>
              <Divider my={4} />
              <Pagination page={page} setPage={setPage} pages={pages} />
            </>
          )}

          {products.length === 0 && <Text textAlign="center">No hay productos...</Text>}
        </>
      )}
    </>
  )
}

Products.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Products
