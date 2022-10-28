import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { PaymentMethodWithConversion } from 'types/paymentMethod'
import { EditPaymentMethodModal } from './EditPaymentMethodModal'

export const PaymentMethodItem = ({
  paymentMethod
}: {
  paymentMethod: PaymentMethodWithConversion
}) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">
      {paymentMethod.name} - {paymentMethod.currency.symbol}
    </Text>
    <EditPaymentMethodModal paymentMethod={paymentMethod} />
  </SimpleBox>
)
