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
import ExchangeRateForm from './ExchangeRateForm'

function UpdateExchangeRateModal() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Actualizar tasa de cambio
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Actualizar tasa de cambio</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ExchangeRateForm />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">Actualizar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateExchangeRateModal
