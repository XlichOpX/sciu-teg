import { Button, Checkbox, FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react'
import { Select as RSelect } from 'chakra-react-select'
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
          <RSelect
            placeholder="Seleccionar cuentas"
            isMulti
            options={[
              { value: 'X', label: 'Cuenta X' },
              { value: 'Y', label: 'Cuenta Y' },
              { value: 'Z', label: 'Cuenta Z' }
            ]}
          />
        </FormControl>
      </SimpleBox>
    </VStack>
  )
}

export default Sidebar
