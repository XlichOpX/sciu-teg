import { Text } from '@chakra-ui/react'
import { PaymentMethod } from '@prisma/client'
import { SimpleBox } from 'components'
import { PaymentMethodInput } from 'types/paymentMethod'
import EditPaymentMethodModal from './EditPaymentMethodModal'

function PaymentMethodItem({
  paymentMethod,
  onUpdate
}: {
  paymentMethod: PaymentMethod
  onUpdate: (data: PaymentMethodInput) => Promise<void>
}) {
  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{paymentMethod.name}</Text>
      <EditPaymentMethodModal paymentMethod={paymentMethod} onSubmit={onUpdate} />
    </SimpleBox>
  )
}

export default PaymentMethodItem
