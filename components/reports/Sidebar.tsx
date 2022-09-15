import { Button, Checkbox, FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react'
import { SimpleBox } from 'components'

function Sidebar() {
  return (
    <VStack align="stretch" as="form">
      <SimpleBox>
        <VStack>
          <FormControl>
            <FormLabel>Tipo de informe</FormLabel>
            <Select>
              <option>Arqueo de caja</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Fecha de inicio</FormLabel>
            <Input type="date" />
          </FormControl>

          <FormControl>
            <FormLabel>Fecha de fin</FormLabel>
            <Input type="date" />
          </FormControl>

          <Button w="full" colorScheme="blue">
            Ver informe
          </Button>
        </VStack>
      </SimpleBox>

      <SimpleBox>
        <FormControl>
          <FormLabel>Métodos de pago</FormLabel>
          <VStack align="flex-start">
            <Checkbox>Efectivo</Checkbox>
            <Checkbox>Tarjeta</Checkbox>
            <Checkbox>Transferencia</Checkbox>
          </VStack>
        </FormControl>
      </SimpleBox>

      <SimpleBox>
        <FormControl>
          <FormLabel>Cuentas</FormLabel>
          <VStack align="flex-start">
            <Checkbox>Cuenta X</Checkbox>
            <Checkbox>Cuenta Y</Checkbox>
            <Checkbox>Cuenta Z</Checkbox>
          </VStack>
        </FormControl>
      </SimpleBox>
    </VStack>
  )
}

export default Sidebar
