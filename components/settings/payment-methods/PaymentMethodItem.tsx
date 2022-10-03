import { Text } from '@chakra-ui/react'
import { PaymentMethod } from '@prisma/client'
import { SimpleBox } from 'components'
import EditPaymentMethodModal from './EditPaymentMethodModal'

function PaymentMethodItem({ paymentMethod }: { paymentMethod: PaymentMethod }) {
  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{paymentMethod.name}</Text>
      <EditPaymentMethodModal />
    </SimpleBox>
  )
}

export default PaymentMethodItem
