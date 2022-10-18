import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ConversionItem } from './ConversionItem'

export const ConversionList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid as="ul" listStyleType="none" minChildWidth="2xs" gap={4}>
    {children}
  </SimpleGrid>
)

ConversionList.Item = ConversionItem
