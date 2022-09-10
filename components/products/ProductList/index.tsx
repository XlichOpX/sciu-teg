import { SimpleGrid } from '@chakra-ui/react'
import ProductItem from './ProductItem'

function ProductList() {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
      {Array(20)
        .fill(1)
        .map((e, i) => (
          <ProductItem key={i} />
        ))}
    </SimpleGrid>
  )
}

export default ProductList
