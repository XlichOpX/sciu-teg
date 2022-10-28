import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { CareerItem } from './CareerItem'

export const CareerList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)

CareerList.Item = CareerItem
