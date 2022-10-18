import { Text, VStack } from '@chakra-ui/react'
import { Conversion } from '@prisma/client'
import { SimpleBox } from 'components/app'
import dayjs from 'dayjs'
import { EditConversionModal } from './EditConversionModal'

export const ConversionItem = ({ conversion }: { conversion: Conversion }) => {
  const isRecent = dayjs(conversion.date).add(30, 'minute').isAfter(dayjs())

  return (
    <SimpleBox as="li" pos="relative">
      {isRecent && <EditConversionModal conversion={conversion} />}

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
}
