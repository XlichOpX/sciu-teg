import { Table, TableContainer, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { Fragment } from 'react'
import { GroupedCategoryReport } from 'types/report'

export const ArqByCategoryReport = ({ data }: { data: GroupedCategoryReport }) => {
  return (
    <>
      <TableContainer>
        <Table>
          <Tbody>
            {Object.keys(data).map((key) => (
              <Fragment key={key}>
                <Tr key={key}>
                  <Th scope="rowgroup" color="black" _dark={{ color: 'white' }} pb={2} py={6}>
                    {key}
                  </Th>
                  <Td textAlign="right" fontWeight="medium" pb={2} py={6}>
                    Total: $ {data[key].reduce((ac, c) => ac + c.amount, 0)}
                  </Td>
                </Tr>

                {data[key].map((row, index) => (
                  <Tr key={index}>
                    <Td pl={10} py={2}>
                      <i>{row.currency.name}</i>
                    </Td>
                    <Td textAlign="right" py={2}>
                      $ {row.amount}
                    </Td>
                  </Tr>
                ))}
              </Fragment>
            ))}

            <Tr>
              <Td colSpan={2} textAlign="right" fontWeight="medium">
                TOTAL GENERAL: ${' '}
                {Object.values(data).reduce(
                  (grandTotal, category) =>
                    grandTotal + category.reduce((total, current) => total + current.amount, 0),
                  0
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
