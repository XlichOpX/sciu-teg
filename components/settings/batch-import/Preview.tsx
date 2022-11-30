import { Heading, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'
import { sheetSchema } from 'schema/batchImportSchema'
import { parseCellContent } from 'utils/parseCellContent'
import { utils } from 'xlsx'
import type { z } from 'zod'

export const Preview = ({
  sheet,
  errors
}: {
  sheet: { headings: unknown[]; data: unknown[][] }
  errors?: z.inferFormattedError<typeof sheetSchema>
}) => {
  return (
    <>
      <Heading size="lg">Previsualización</Heading>
      <TableContainer>
        <Table>
          <Tbody>
            <Tr>
              <Td></Td>
              {Array.from({ length: 10 }).map((_, i) => (
                <Td key={i} textAlign="center">
                  {utils.encode_col(i)}
                </Td>
              ))}
            </Tr>
            <Tr>
              <Td>1</Td>
              {sheet.headings.map((h, i) => (
                <Td key={i} bgColor={errors?.headings?.[i] ? 'red.200' : undefined}>
                  {parseCellContent(h)}
                </Td>
              ))}
            </Tr>
            {sheet.data.map((row, i) => (
              <Tr key={i}>
                <Td>{i + 2}</Td>
                {row.map((cell, j) => (
                  <Td key={j} bgColor={errors?.data?.[i]?.[j] ? 'red.200' : undefined}>
                    {parseCellContent(cell)}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
