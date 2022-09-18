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
import EditButton from 'components/EditButton'
import ExchangeRateForm from './ExchangeRateForm'

function EditExchangeRateModal() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <EditButton onClick={onOpen} pos="absolute" top={4} right={4} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Editar tasa de cambio</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ExchangeRateForm />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">Guardar cambios</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditExchangeRateModal
