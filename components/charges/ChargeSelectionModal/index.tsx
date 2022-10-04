import {
  Button,
  ButtonProps,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VisuallyHidden
} from '@chakra-ui/react'
import { CancelButton, SaveButton } from 'components'
import { BsPlusLg, BsWalletFill } from 'react-icons/bs'

function ChargeSelectionModal(props: ButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={<BsWalletFill />} colorScheme="blue" onClick={onOpen} {...props}>
        Cobrar selección
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Registrar cobro</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th pl={0}>Producto</Th>
                    <Th textAlign="center">Cantidad</Th>
                    <Th pr={0} colSpan={2}>
                      Precio
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Array(3)
                    .fill(1)
                    .map((_, i) => (
                      <Tr key={i}>
                        <Td pl={0}>Mensualidad #{i + 1}</Td>
                        <Td>1</Td>
                        <Td textAlign="right" pr={0}>
                          $20
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                  <Tr fontWeight="bold">
                    <Td pl={0} colSpan={2}>
                      Total
                    </Td>
                    <Td pr={0} textAlign="right">
                      $60
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>

            <Heading as="h3" size="sm" my={4}>
              Métodos de pago
            </Heading>

            <form>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl as={GridItem}>
                  <Select>
                    <option>Efectivo</option>
                  </Select>
                </FormControl>

                <FormControl as={GridItem}>
                  <Input placeholder="Monto" />
                </FormControl>
              </Grid>
            </form>

            <Button mt={4} width="full" size="sm">
              <VisuallyHidden>Agregar método de pago</VisuallyHidden>
              <BsPlusLg />
            </Button>
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton>Registrar cobro</SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChargeSelectionModal
