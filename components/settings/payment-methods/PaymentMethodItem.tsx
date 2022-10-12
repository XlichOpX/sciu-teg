import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { PaymentMethodInput } from 'types/paymentMethod'
import { EditPaymentMethodModal } from './EditPaymentMethodModal'

export const PaymentMethodItem = ({
  paymentMethod,
  onUpdate,
  onDelete
}: {
  paymentMethod: any
  onUpdate: (data: PaymentMethodInput) => Promise<void>
  onDelete: () => Promise<void>
}) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">
      {paymentMethod.name} - {paymentMethod.currency.symbol}
    </Text>
    <EditPaymentMethodModal paymentMethod={paymentMethod} onSubmit={onUpdate} onDelete={onDelete} />
  </SimpleBox>
)
