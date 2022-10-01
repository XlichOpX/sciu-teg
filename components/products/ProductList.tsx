import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'

function ProductList({ children }: { children: ReactNode }) {
  return (
    <SimpleGrid minChildWidth="2xs" listStyleType="none" gap={4}>
      {children}
    </SimpleGrid>
  )
}

export default ProductList
