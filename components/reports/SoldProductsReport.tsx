import { Table, TableContainer, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { groupBy } from 'lodash'
import { Fragment } from 'react'
import { ProductReport } from 'types/report'

export const SoldProductsReport = ({ data }: { data: ProductReport[] }) => {
  const groupedData = groupBy(data, 'category.name')

  return (
    <>
      <TableContainer>
        <Table>
          <Tbody>
            {Object.keys(groupedData).map((key) => (
              <Fragment key={key}>
                <Tr key={key}>
                  <Th scope="rowgroup" color="black" _dark={{ color: 'white' }} pb={2} pt={6}>
                    {key}
                  </Th>
                  <Th textAlign="center" pb={2} pt={6} scope="colgroup">
                    Cantidad
                  </Th>
                  <Td textAlign="right" fontWeight="medium" pb={2} pt={6}>
                    Total: $ {groupedData[key].reduce((ac, c) => ac + c.amount, 0).toLocaleString()}
                  </Td>
                </Tr>

                {groupedData[key].map((row, index) => (
                  <Tr key={index}>
                    <Td pl={10} py={2}>
                      <i>{row.name}</i>
                    </Td>
                    <Td textAlign="center">{row.quantity}</Td>
                    <Td isNumeric py={2}>
                      $ {row.amount.toLocaleString()}
                    </Td>
                  </Tr>
                ))}
              </Fragment>
            ))}

            <Tr>
              <Td colSpan={3} textAlign="right" fontWeight="medium">
                TOTAL GENERAL: ${' '}
                {Object.values(groupedData)
                  .reduce(
                    (grandTotal, payMethod) =>
                      grandTotal + payMethod.reduce((total, current) => total + current.amount, 0),
                    0
                  )
                  .toLocaleString()}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
