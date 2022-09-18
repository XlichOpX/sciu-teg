import { Divider } from '@chakra-ui/react'
import { BaseLayout, HeadingWithSearch, Pagination } from 'components'
import { ProductList } from 'components/products'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'

const Products: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Productos</title>
      </Head>

      <HeadingWithSearch title="Productos" placeholder="Buscar productos" />

      <ProductList />

      <Divider my={4} />

      <Pagination />
    </>
  )
}

Products.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Products
