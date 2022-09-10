import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Pagination from 'components/Pagination'

function ReceiptList() {
  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th pl={0}>Fecha</Th>
              <Th>Recibo N°</Th>
              <Th>Cédula</Th>
              <Th pr={0}>Monto</Th>
            </Tr>
          </Thead>

          <Tbody>
            {Array(20)
              .fill(1)
              .map((e, i) => (
                <Tr key={i}>
                  <Td pl={0}>10/09/2022</Td>
                  <Td>123456</Td>
                  <Td>29784799</Td>
                  <Td pr={0}>$40</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Pagination />
    </>
  )
}

export default ReceiptList
