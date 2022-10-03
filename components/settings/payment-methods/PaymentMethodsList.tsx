import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PaymentMethodItem from './PaymentMethodItem'

function PaymentMethodsList({ children }: { children: ReactNode }) {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
      {children}
    </SimpleGrid>
  )
}

PaymentMethodsList.Item = PaymentMethodItem

export default PaymentMethodsList
