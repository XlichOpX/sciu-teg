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
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { CancelButton, SaveButton } from 'components/app'
import { SubmitHandler } from 'react-hook-form'
import { BsWalletFill } from 'react-icons/bs'
import { createReceipt } from 'services/receipts'
import { BillingComparatorArgs } from 'types/billing'
import { ProductReceivable } from './BillingsForm'
import { ChargesForm, ChargesFormData } from './ChargesForm'

interface ChargeSelectionModalProps extends ButtonProps {
  billings: BillingComparatorArgs[]
  personId: number
  products: ProductReceivable[]
  onRecord: () => void
}

export const ChargeSelectionModal = ({
  billings,
  personId,
  products,
  onRecord,
  ...props
}: ChargeSelectionModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()

  const totalAmount =
    billings.reduce((ac, sb) => ac + sb.amount, 0) +
    products.reduce((ac, p) => ac + p.price * p.quantity, 0)

  const onRecordCharge: SubmitHandler<ChargesFormData> = async (data) => {
    try {
      const receipt = await createReceipt({
        ...data,
        billings: billings.map((sb) => sb.id),
        products: products.map((p) => ({ id: p.id, quantity: p.quantity })),
        amount: totalAmount,
        person: personId
      })
      onRecord()
      onClose()
      toast({ status: 'success', description: 'Cobro registrado' })
      window.open(window.location.origin + `/recibos/${receipt.id}`)
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al registrar el cobro' })
    }
  }

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
                    <Th pr={0} textAlign="right" colSpan={2}>
                      Precio
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {billings.map((sb) => (
                    <Tr key={sb.id}>
                      <Td pl={0}>{sb.productName}</Td>
                      <Td textAlign="right" pr={0}>
                        {sb.amount}
                      </Td>
                    </Tr>
                  ))}

                  {products.map((p) => (
                    <Tr key={p.id}>
                      <Td pl={0}>
                        {p.name} (x{p.quantity})
                      </Td>
                      <Td textAlign="right" pr={0}>
                        {p.price * p.quantity}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>

                <Tfoot>
                  <Tr fontWeight="bold">
                    <Td pl={0}>Total</Td>
                    <Td pr={0} textAlign="right">
                      {totalAmount}
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>

            <Divider mb={3} />

            <ChargesForm id="ChargesForm" maxAmount={totalAmount} onSubmit={onRecordCharge} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="ChargesForm">
              Registrar cobro
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
