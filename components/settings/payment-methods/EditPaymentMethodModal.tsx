import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@chakra-ui/react'
import EditButton from 'components/EditButton'
import { BsTrash } from 'react-icons/bs'

function EditPaymentMethodModal() {
  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <>
      <EditButton onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Editar método X</h3>
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
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar método de pago">
              <BsTrash />
            </Button>

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

export default EditPaymentMethodModal
