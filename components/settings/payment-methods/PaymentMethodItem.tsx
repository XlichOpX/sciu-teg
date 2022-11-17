import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { PaymentMethodWithCurrencies } from 'types/paymentMethod'
import { EditPaymentMethodModal } from './EditPaymentMethodModal'

export const PaymentMethodItem = ({
  paymentMethod
}: {
  paymentMethod: PaymentMethodWithCurrencies
}) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{paymentMethod.name}</Text>
      {user?.permissions.includes('EDIT_PAYMENTMETHOD') && (
        <EditPaymentMethodModal paymentMethod={paymentMethod} />
      )}
    </SimpleBox>
  )
}
