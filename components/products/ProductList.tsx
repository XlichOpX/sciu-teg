import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const ProductList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)
