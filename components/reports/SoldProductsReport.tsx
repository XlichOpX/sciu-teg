import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { ProductReport } from 'types/report'

export const SoldProductsReport = ({ data }: { data: ProductReport[] }) => {
  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Producto</Th>
              <Th textAlign="center">Cantidad</Th>
              <Th isNumeric>Monto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td textAlign="center">{product.quantity}</Td>
                <Td isNumeric>$ {product.amount.toFixed()}</Td>
              </Tr>
            ))}

            <Tr>
              <Td colSpan={3} textAlign="right" fontWeight="medium">
                TOTAL GENERAL: $ {data.reduce((ac, product) => ac + product.amount, 0)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
