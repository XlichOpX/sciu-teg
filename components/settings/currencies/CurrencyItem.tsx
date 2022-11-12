import { Text } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { EditCurrencyModal } from './EditCurrencyModal'

export const CurrencyItem = ({ currency }: { currency: Currency }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">
        {currency.name} - {currency.symbol}
      </Text>
      {user?.permissions.includes('EDIT_CURRENCY') && <EditCurrencyModal currency={currency} />}
    </SimpleBox>
  )
}
