import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Checkbox } from '@chakra-ui/react'

function Items({ billings }: { billings: any[] }) {
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
          {billings.map((b, i) => (
            <Tr key={i}>
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
}

export default Items
