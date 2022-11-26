import { chakra, Divider, Flex, Text } from '@chakra-ui/react'
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
    <SimpleBox as="li">
      <Flex justifyContent="space-between">
        <Text fontWeight="bold">{paymentMethod.name}</Text>
        {user?.permissions.includes('EDIT_PAYMENTMETHOD') && (
          <EditPaymentMethodModal paymentMethod={paymentMethod} />
        )}
      </Flex>
      <Divider my={2} />
      <Text>{paymentMethod.description}</Text>
      <Divider my={2} />
      <Text>Monedas: {paymentMethod.currencies.map((c) => c.symbol).join(' | ')}</Text>
      <Text>
        Datos adicionales: {paymentMethod.metaPayment?.map((mp) => mp.name).join(' | ')}
        {!paymentMethod.metaPayment?.length && (
          <chakra.span fontStyle="italic">ninguno</chakra.span>
        )}
      </Text>
    </SimpleBox>
  )
}
