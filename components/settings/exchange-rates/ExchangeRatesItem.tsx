import { Text, VStack } from '@chakra-ui/react'
import SimpleBox from 'components/SimpleBox'
import EditExchangeRateModal from './EditExchangeRateModal'

function ExchangeRatesItem() {
  return (
    <SimpleBox as="li" pos="relative">
      <EditExchangeRateModal />

      <VStack align="stretch">
        <p>
          <Text as="span" fontWeight="bold">
            Fecha:
          </Text>{' '}
          {new Date().toLocaleString()}
        </p>

        <p>
          <Text as="span" fontWeight="bold">
            Dólar:
          </Text>{' '}
          8,15
        </p>

        <p>
          <Text as="span" fontWeight="bold">
            Euro:
          </Text>{' '}
          8,15
        </p>
      </VStack>
    </SimpleBox>
  )
}

export default ExchangeRatesItem
