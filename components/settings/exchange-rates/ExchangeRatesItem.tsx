import { Text, VStack } from '@chakra-ui/react'
import { Conversion } from '@prisma/client'
import { SimpleBox } from 'components/app'
import dayjs from 'dayjs'
import { EditExchangeRateModal } from './EditExchangeRateModal'

export const ExchangeRatesItem = ({ conversion }: { conversion: Conversion }) => (
  <SimpleBox as="li" pos="relative">
    <EditExchangeRateModal />

    <VStack align="stretch">
      <p>
        <Text as="span" fontWeight="bold">
          Fecha:
        </Text>{' '}
        {dayjs(conversion.date).format('MM/DD/YYYY h:mm A')}
      </p>

      <p>
        <Text as="span" fontWeight="bold">
          Dólar:
        </Text>{' '}
        {conversion.dolar.toFixed(2)}
      </p>

      <p>
        <Text as="span" fontWeight="bold">
          Euro:
        </Text>{' '}
        {conversion.euro.toFixed(2)}
      </p>
    </VStack>
  </SimpleBox>
)
