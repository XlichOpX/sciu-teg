import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { DoctypeItem } from './DoctypeItem'

export const DoctypeList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)

DoctypeList.Item = DoctypeItem
