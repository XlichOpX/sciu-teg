import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { ReceiptList } from 'components/receipts'
import { ReceiptWithPerson } from 'types/receipt'

export const CreatedReceiptsModal = ({
  receipts,
  isOpen,
  onClose
}: {
  receipts?: ReceiptWithPerson[]
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recibos creados</ModalHeader>
        <ModalCloseButton />

        <ModalBody>{receipts && <ReceiptList receipts={receipts} />}</ModalBody>

        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
