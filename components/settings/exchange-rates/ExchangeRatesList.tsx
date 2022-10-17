import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ExchangeRatesItem } from './ExchangeRatesItem'

export const ExchangeRatesList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid as="ul" listStyleType="none" minChildWidth="2xs" gap={4}>
    {children}
  </SimpleGrid>
)

ExchangeRatesList.Item = ExchangeRatesItem
