import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Checkbox } from '@chakra-ui/react'

function MonthlyPayments() {
  return (
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
          {Array(6)
            .fill(1)
            .map((e, i) => (
              <Tr key={i}>
                <Td pl={0}>Mensualidad #{i + 1}</Td>
                <Td textAlign="center">$20</Td>
                <Td textAlign="center" pr={0}>
                  <Checkbox />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default MonthlyPayments
