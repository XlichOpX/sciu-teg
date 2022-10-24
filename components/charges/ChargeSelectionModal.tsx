import {
  Button,
  ButtonProps,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import { CancelButton, SaveButton } from 'components/app'
import { BsWalletFill } from 'react-icons/bs'
import { BillingComparatorArgs } from 'types/billing'
import { ChargesForm } from './ChargesForm'

interface ChargeSelectionModalProps extends ButtonProps {
  selectedBillings: BillingComparatorArgs[]
}

export const ChargeSelectionModal = ({ selectedBillings, ...props }: ChargeSelectionModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const maxAmount = selectedBillings.reduce((ac, sb) => ac + sb.amount, 0)

  return (
    <>
      <Button leftIcon={<BsWalletFill />} colorScheme="blue" onClick={onOpen} {...props}>
        Cobrar selección
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
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
                    <Th pl={0}>Concepto</Th>
                    <Th textAlign="center">Cantidad</Th>
                    <Th pr={0} textAlign="right" colSpan={2}>
                      Precio
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {selectedBillings.map((sb) => (
                    <Tr key={sb.id}>
                      <Td pl={0}>{sb.productName}</Td>
                      <Td textAlign="center">1</Td>
                      <Td textAlign="right" pr={0}>
                        {sb.amount}
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
                      {maxAmount}
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>

            <Divider mb={3} />

            <ChargesForm
              id="ChargesForm"
              maxAmount={maxAmount}
              onSubmit={(data) => console.log(data)}
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="ChargesForm">
              Registrar cobro
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
