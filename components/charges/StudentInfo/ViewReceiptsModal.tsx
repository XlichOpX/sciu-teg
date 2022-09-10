import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { ReceiptList } from 'components/receipts'
import { BsFileText } from 'react-icons/bs'

function ViewReceiptsModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button leftIcon={<BsFileText />} onClick={onOpen}>
        Ver recibos
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recibos de Fulano</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReceiptList showIdCol={false} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewReceiptsModal
