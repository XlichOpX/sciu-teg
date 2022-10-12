import { SimpleGrid } from '@chakra-ui/react'
import { ExchangeRatesItem } from './ExchangeRatesItem'

export const ExchangeRatesList = () => (
  <SimpleGrid as="ul" listStyleType="none" minChildWidth="2xs" gap={4}>
    {Array(12)
      .fill(1)
      .map((_, i) => (
        <ExchangeRatesItem key={i} />
      ))}
  </SimpleGrid>
)
