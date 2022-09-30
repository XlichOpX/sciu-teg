import { SimpleGrid } from '@chakra-ui/react'
import { ProductWithCategory } from 'pages/api/product'
import ProductItem from './ProductItem'

function ProductList({ products }: { products: ProductWithCategory[] }) {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
      {products.map((p) => (
        <ProductItem key={p.id} product={p} />
      ))}
    </SimpleGrid>
  )
}

export default ProductList
