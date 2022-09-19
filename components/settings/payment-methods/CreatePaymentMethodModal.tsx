import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'

function CreatePaymentMethodModal() {
  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Crear método de pago
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Crear método de pago</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">Crear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePaymentMethodModal
