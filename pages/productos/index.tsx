import { Alert, Divider } from '@chakra-ui/react'
import { BaseLayout, HeadingWithSearch, Pagination } from 'components'
import { ProductList } from 'components/products'
import Placeholder from 'components/products/placeholder'
import useProducts from 'hooks/useProducts'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'

const Products: NextPageWithLayout = () => {
  const { products, error, isLoading } = useProducts()

  return (
    <>
      <Head>
        <title>Productos</title>
      </Head>

      <HeadingWithSearch title="Productos" placeholder="Buscar productos" />

      {error && <Alert status="error">{error}</Alert>}
      {isLoading && <Placeholder />}
      {products && <ProductList products={products} error={error} />}

      <Divider my={4} />

      <Pagination />
    </>
  )
}

Products.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Products
