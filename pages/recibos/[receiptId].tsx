import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useParameters, useReceipt } from 'hooks'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { BsPrinterFill } from 'react-icons/bs'
import { MetaPaymentData } from 'types/paymentMethod'

const Receipts: NextPage = () => {
  const router = useRouter()
  const { receipt } = useReceipt(Number(router.query.receiptId))
  const { parameters } = useParameters()

  if (!receipt || !parameters)
    return (
      <Flex w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    )

  const print = () => {
    window.print()
  }

  return (
    <Container maxW="container.lg" py={4}>
      <Head>
        <title>Recibo {receipt?.id}</title>
      </Head>

      <Stack
        as="header"
        direction={['column', 'row']}
        justify="space-between"
        align="center"
        sx={{
          '@media print': {
            flexDirection: 'row'
          }
        }}
      >
        <Heading as="span">SCIU</Heading>
        <Text
          textAlign={['center', 'right']}
          sx={{
            '@media print': {
              textAlign: 'right'
            }
          }}
        >
          {parameters.institute}
          <br />
          RIF: {parameters.rif}
          <br />
          {parameters.address}
          <br />
          {parameters.population}
          <br />
          {parameters.phone}
          <br />
        </Text>
      </Stack>

      <Divider my={4} />

      <Stack
        direction={['column', 'row']}
        justify="space-between"
        sx={{
          '@media print': {
            flexDirection: 'row'
          }
        }}
      >
        <Text>
          Persona: {receipt.person.firstName} {receipt.person.firstLastName}
        </Text>
        <Text>
          {receipt.person.docType.type}-{receipt.person.docNumber}
        </Text>
        <Text>Fecha: {dayjs(receipt.createdAt).format('MM/DD/YYYY h:mm A')}</Text>
      </Stack>

      <Divider my={4} />

      <HStack as="h1" fontWeight="bold" justify="space-between" align="center">
        <span>RECIBO DE PAGO</span>
        <span>N° {receipt.id}</span>
      </HStack>

      <Divider my={4} />

      <TableContainer mb={4}>
        <Table>
          <Thead>
            <Tr>
              <Th pl={0}>Concepto</Th>
              <Th textAlign="center">Precio</Th>
              <Th textAlign="center">Cantidad</Th>
              <Th textAlign="right" pr={0}>
                Total
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {receipt.chargedProducts.map((cp) => (
              <Tr key={cp.id}>
                <Td pl={0}>{cp.billing ? cp.billing.productName : cp.product.name}</Td>
                <Td textAlign="center">{cp.price.toFixed(2)}</Td>
                <Td textAlign="center">{cp.quantity ?? 1}</Td>
                <Td pr={0} textAlign="right">
                  {(cp.price * (cp.quantity ?? 1)).toFixed(2)}
                </Td>
              </Tr>
            ))}
          </Tbody>

          <Tfoot>
            <Tr>
              <Td colSpan={3} pl={0} fontWeight="bold">
                TOTAL
              </Td>
              <Td fontWeight="bold" pr={0} textAlign="right">
                {receipt.amount.toFixed(2)}
              </Td>
            </Tr>
            {receipt.charges.map((c) => (
              <Tr key={c.id}>
                <Td colSpan={3} pl={6}>
                  <Text fontWeight="bold">
                    {c.paymentMethod.name} - {c.paymentMethod.currency.symbol}
                  </Text>
                  <Box as="ul" listStyleType="none" pl={4}>
                    {Array.isArray(c.metaPayment) &&
                      (c.metaPayment as MetaPaymentData[]).map((mp, i) => (
                        <li key={i}>
                          {mp.name}:{' '}
                          {mp.fieldType === 'date'
                            ? dayjs(mp.value).format('MM/DD/YYYY')
                            : mp.value}
                        </li>
                      ))}
                  </Box>
                </Td>
                <Td fontWeight="bold" pr={0} textAlign="right">
                  {c.amount.toFixed(2)}
                </Td>
              </Tr>
            ))}
          </Tfoot>
        </Table>
      </TableContainer>

      <Stack
        direction={['column-reverse', 'row']}
        justify="center"
        align="stretch"
        sx={{
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Button colorScheme="blue" leftIcon={<BsPrinterFill />} onClick={print}>
          Imprimir
        </Button>
      </Stack>
    </Container>
  )
}

export default Receipts
