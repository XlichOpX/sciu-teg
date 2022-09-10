import { Divider } from '@chakra-ui/react'
import { HeadingWithSearch, Pagination } from 'components'
import { ProductList } from 'components/products'
import { NextPage } from 'next'
import Head from 'next/head'

const Products: NextPage = () => {
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

export default Products
