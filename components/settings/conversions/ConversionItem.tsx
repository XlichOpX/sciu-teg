import { Text, VStack } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import dayjs from 'dayjs'
import { useAuth } from 'hooks'
import { ConversionWithCurrency } from 'types/conversion'
import { EditConversionModal } from './EditConversionModal'

export const ConversionItem = ({ conversion }: { conversion: ConversionWithCurrency }) => {
  const isRecent = dayjs(conversion.date).add(30, 'minute').isAfter(dayjs())
  const { user } = useAuth()

  return (
    <SimpleBox as="li" pos="relative">
      {isRecent && user?.permissions.includes('EDIT_CONVERSION') && (
        <EditConversionModal conversion={conversion} />
      )}

      <VStack align="stretch">
        <p>
          <Text as="span" fontWeight="bold">
            Fecha:
          </Text>{' '}
          {dayjs(conversion.date).format('MM/DD/YYYY h:mm A')}
        </p>

        <p>
          <Text as="span" fontWeight="bold">
            Moneda:
          </Text>{' '}
          {conversion.currency.symbol} - {conversion.currency.name}
        </p>

        <p>
          <Text as="span" fontWeight="bold">
            Tasa:
          </Text>{' '}
          {conversion.currency.symbol} {conversion.value.toFixed(2)} = $1
        </p>
      </VStack>
    </SimpleBox>
  )
}
