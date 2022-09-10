import {
  Button,
  CloseButton,
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
  Tr,
  useDisclosure,
  VisuallyHidden
} from '@chakra-ui/react'
import { BsPlusLg, BsWalletFill } from 'react-icons/bs'

function ChargeSelectionModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={<BsWalletFill />} colorScheme="blue" onClick={onOpen}>
        Cobrar selección
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Cobrar mensualidades</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <TableContainer>
              <Table size="sm">
                <Tbody>
                  {Array(3)
                    .fill(1)
                    .map((_, i) => (
                      <Tr key={i}>
                        <Td pl={0}>Mensualidad #{i + 1}</Td>
                        <Td textAlign="right">$20</Td>
                        <Td pr={0}>
                          <CloseButton size="sm" mx="auto" color="red" />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                  <Tr fontWeight="bold">
                    <Td pl={0}>Total</Td>
                    <Td textAlign="right">$60</Td>
                    <Td></Td>
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
            <Button mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme="blue">Confirmar cobro</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChargeSelectionModal
