import {
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  ThemingProps,
  Tr,
  VisuallyHidden
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import NLink from 'next/link'

export const ReceiptList = ({
  size,
  showIdCol = true,
  receipts
}: {
  size?: ThemingProps<'Table'>['size']
  showIdCol?: boolean
  receipts: any[]
}) => (
  <>
    <TableContainer>
      <Table size={size}>
        <Thead>
          <Tr>
            <Th pl={0}>Fecha</Th>
            <Th textAlign="center">Recibo N°</Th>
            {showIdCol && <Th textAlign="center">Cédula</Th>}
            <Th pr={0}>Monto</Th>
          </Tr>
        </Thead>

        <Tbody>
          {receipts.map((r) => (
            <Tr key={r.id} pos="relative" _hover={{ backgroundColor: 'gray.50' }}>
              <Td pl={0}>{dayjs(r.createdAt).format('YYYY/MM/DD')}</Td>
              <Td textAlign="center">
                {r.id}
                <NLink href={`/recibos/${r.id}`} passHref>
                  <Link target="_blank" pos="absolute" inset={0}>
                    <VisuallyHidden>Recibo número: {r.id}</VisuallyHidden>
                  </Link>
                </NLink>
              </Td>
              {showIdCol && (
                <Td textAlign="center">
                  {r.person.docType.type}-{r.person.docNumber}
                </Td>
              )}
              <Td pr={0} textAlign="right">
                {r.amount}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </>
)
