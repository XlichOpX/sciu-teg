import { Text } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { EditCurrencyModal } from './EditCurrencyModal'

export const CurrencyItem = ({ currency }: { currency: Currency }) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">
      {currency.name} - {currency.symbol}
    </Text>
    <EditCurrencyModal currency={currency} />
  </SimpleBox>
)
