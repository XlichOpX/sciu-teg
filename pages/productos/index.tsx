import { Alert, Divider, Flex } from '@chakra-ui/react'
import { Pagination, SearchInput } from 'components/app'
import { BaseLayout } from 'components/layouts'
import { CreateProductModal, Placeholder, ProductItem, ProductList } from 'components/products'
import { useAuth, useProducts } from 'hooks'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'

const Products: NextPageWithLayout = () => {
  const { products, page, pages, setPage, setSearch, error, isLoading } = useProducts({
    itemsPerPage: 20
  })

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_PRODUCT')) {
    return <Alert status="error">No tiene permiso para ver los productos</Alert>
  }

  return (
    <>
      <Head>
        <title>Productos</title>
      </Head>

      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar productos" onChange={({ text }) => setSearch(text)} />
        {user?.permissions.includes('CREATE_PRODUCT') && <CreateProductModal />}
      </Flex>
      <Divider my={4} />

      {error && <Alert status="error">{error.message}</Alert>}
      {isLoading && <Placeholder />}
      {products && (
        <>
          <ProductList>
            {products.map((p) => (
              <ProductItem key={p.id} product={p} />
            ))}
          </ProductList>

          {products.length === 0 && <Alert>Sin resultados...</Alert>}

          {!!pages && pages > 0 && (
            <>
              <Divider my={4} />
              <Pagination page={page} setPage={setPage} pages={pages} />
            </>
          )}
        </>
      )}
    </>
  )
}

Products.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Products
