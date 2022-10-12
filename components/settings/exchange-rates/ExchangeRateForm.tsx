import { FormControl, FormLabel, Input, SimpleGrid } from '@chakra-ui/react'
import { ComponentPropsWithoutRef } from 'react'

export const ExchangeRateForm = (props: ComponentPropsWithoutRef<'form'>) => (
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
