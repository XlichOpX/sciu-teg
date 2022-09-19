import { SimpleGrid } from '@chakra-ui/react'
import PaymentMethodItem from './PaymentMethodItem'

function PaymentMethodsList() {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
      {Array(4)
        .fill(1)
        .map((_, i) => (
          <PaymentMethodItem key={i} />
        ))}
    </SimpleGrid>
  )
}

export default PaymentMethodsList
