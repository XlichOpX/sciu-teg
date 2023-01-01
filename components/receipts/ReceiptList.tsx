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
  useColorModeValue,
  VisuallyHidden
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ReceiptWithPerson } from 'types/receipt'

export const ReceiptList = ({
  size,
  showIdCol = true,
  receipts
}: {
  size?: ThemingProps<'Table'>['size']
  showIdCol?: boolean
  receipts: ReceiptWithPerson[]
}) => {
  const hoverColor = useColorModeValue('gray.50', 'whiteAlpha.100')

  return (
    <TableContainer>
      <Table size={size}>
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th textAlign="center">Recibo N°</Th>
            {showIdCol && <Th textAlign="center">N° de documento</Th>}
            <Th textAlign="center">Monto</Th>
          </Tr>
        </Thead>

        <Tbody>
          {receipts.map((r) => (
            <Tr key={r.id} pos="relative" _hover={{ backgroundColor: hoverColor }}>
              <Td>{dayjs(r.createdAt).format('YYYY/MM/DD')}</Td>
              <Td textAlign="center">
                {r.id}
                <Link pos="absolute" inset={0} href={`/recibos/${r.id}`} target="_blank">
                  <VisuallyHidden>Recibo número: {r.id}</VisuallyHidden>
                </Link>
              </Td>
              {showIdCol && (
                <Td textAlign="center">
                  {r.person.docType.type}-{r.person.docNumber}
                </Td>
              )}
              <Td textAlign="center">$ {r.amount.toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
