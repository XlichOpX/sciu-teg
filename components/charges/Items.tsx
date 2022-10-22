import { Checkbox, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { BillingComparatorArgs } from 'types/billing'

export const Items = ({ billings }: { billings: BillingComparatorArgs[] }) => (
  <TableContainer>
    <Table>
      <Thead>
        <Tr>
          <Th pl={0}>Concepto</Th>
          <Th textAlign="center">Monto</Th>
          <Th textAlign="center" pr={0}>
            Cobrar
          </Th>
        </Tr>
      </Thead>

      <Tbody>
        {billings.map((b) => (
          <Tr key={b.id}>
            <Td pl={0}>{b.productName}</Td>
            <Td textAlign="center">{b.amount}</Td>
            <Td textAlign="center" pr={0}>
              <Checkbox />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
)
