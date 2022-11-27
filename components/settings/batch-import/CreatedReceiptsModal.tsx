import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from '@chakra-ui/react'
import { ReceiptList } from 'components/receipts'
import { useState } from 'react'
import { BsEnvelope } from 'react-icons/bs'
import { sendReceiptsByEmail } from 'services/receipts'
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
  const [isSending, setIsSending] = useState(false)
  const toast = useToast()

  const sendByEmail = async () => {
    if (!receipts) return
    setIsSending(true)
    try {
      await sendReceiptsByEmail(receipts.map((r) => r.id))
      toast({ status: 'success', description: 'Correos enviados' })
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        toast({
          status: 'error',
          description: 'Ocurrió un error al enviar los correos: ' + error.message
        })
      }
    } finally {
      setIsSending(true)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recibos creados</ModalHeader>
        <ModalCloseButton />

        <ModalBody>{receipts && <ReceiptList receipts={receipts} />}</ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button colorScheme="blue" variant="outline" onClick={onClose}>
            Cerrar
          </Button>

          <Button
            colorScheme="blue"
            leftIcon={<BsEnvelope />}
            onClick={sendByEmail}
            isLoading={isSending}
          >
            Enviar recibos por correo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
