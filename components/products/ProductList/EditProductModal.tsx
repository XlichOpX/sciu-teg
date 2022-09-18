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
  SimpleGrid,
  useDisclosure
} from '@chakra-ui/react'
import EditButton from 'components/EditButton'

function EditProductModal() {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <>
      <EditButton onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Editar producto</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Nombre</FormLabel>
                <Input />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Categoría</FormLabel>
                <Input type="number" />
              </FormControl>

              <SimpleGrid columns={2} gap={4}>
                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <Input type="number" />
                </FormControl>

                <FormControl>
                  <FormLabel>Inventario</FormLabel>
                  <Input type="number" />
                </FormControl>
              </SimpleGrid>
            </form>
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

export default EditProductModal
