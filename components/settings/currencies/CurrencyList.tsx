import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { CurrencyItem } from './CurrencyItem'

export const CurrencyList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)

CurrencyList.Item = CurrencyItem
