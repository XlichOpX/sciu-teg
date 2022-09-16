import { SimpleGrid, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { ComponentPropsWithoutRef } from 'react'

function ExchangeRateForm(props: ComponentPropsWithoutRef<'form'>) {
  return (
    <form {...props}>
      <SimpleGrid columns={2} gap={4}>
        <FormControl>
          <FormLabel>Dólar</FormLabel>
          <Input type="number" />
        </FormControl>

        <FormControl>
          <FormLabel>Euro</FormLabel>
          <Input type="number" />
        </FormControl>
      </SimpleGrid>
    </form>
  )
}

export default ExchangeRateForm
