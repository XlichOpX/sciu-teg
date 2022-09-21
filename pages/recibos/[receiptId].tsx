import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
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
import { NextPage } from 'next'
import Head from 'next/head'
import { BsPrinterFill, BsXLg } from 'react-icons/bs'

const Receipts: NextPage = () => {
  const print = () => {
    window.print()
  }

  return (
    <Container maxW="container.lg" py={4}>
      <Head>
        <title>Recibo X</title>
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
          Instituto Universitario X <br />
          RIF: J-12345678-9
          <br />
          Calle cualquiera, Esq. de Nadie
          <br />
          Un lugar de la mancha
          <br />
          Tlfno: 0212 1234567
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
        <Text>Persona: Yhan Montaño</Text>
        <Text>Cédula: 29784799</Text>
        <Text>Fecha: 2022-09-19 20:02:00</Text>
      </Stack>

      <Divider my={4} />

      <HStack as="h1" fontWeight="bold" justify="space-between" align="center">
        <span>RECIBO DE PAGO</span>
        <span>N° 7</span>
      </HStack>

      <Divider my={4} />

      <TableContainer mb={4}>
        <Table>
          <Thead>
            <Tr>
              <Th pl={0}>Concepto</Th>
              <Th>Forma de pago</Th>
              <Th textAlign="right" pr={0}>
                Monto
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td pl={0}>Mensualidad</Td>
              <Td>Efectivo</Td>
              <Td pr={0} textAlign="right">
                Bs. 20
              </Td>
            </Tr>
          </Tbody>

          <Tfoot>
            <Tr>
              <Td></Td>
              <Td fontWeight="bold" textAlign="right">
                TOTAL
              </Td>
              <Td fontWeight="bold" pr={0} textAlign="right">
                Bs. 20
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>

      <Stack
        direction={['column-reverse', 'row']}
        justify="space-between"
        align="stretch"
        sx={{
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Button colorScheme="red" leftIcon={<BsXLg />}>
          Anular
        </Button>

        <Button colorScheme="blue" leftIcon={<BsPrinterFill />} onClick={print}>
          Imprimir
        </Button>
      </Stack>
    </Container>
  )
}

export default Receipts
