import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components'
import EditPaymentMethodModal from './EditPaymentMethodModal'

function PaymentMethodItem() {
  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">Método de pago X</Text>
      <EditPaymentMethodModal />
    </SimpleBox>
  )
}

export default PaymentMethodItem
