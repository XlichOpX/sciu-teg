import { Table, TableContainer, Tbody, Td, Th, Thead, ThemingProps, Tr } from '@chakra-ui/react'
import { Pagination } from 'components/app'

export const ReceiptList = ({
  size,
  showIdCol = true
}: {
  size?: ThemingProps<'Table'>['size']
  showIdCol?: boolean
}) => (
  <>
    <TableContainer>
      <Table size={size}>
        <Thead>
          <Tr>
            <Th pl={0}>Fecha</Th>
            <Th>Recibo N°</Th>
            {showIdCol && <Th>Cédula</Th>}
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
                {showIdCol && <Td>29784799</Td>}
                <Td pr={0}>$40</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>

    <Pagination />
  </>
)
