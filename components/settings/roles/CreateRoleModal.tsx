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
  useDisclosure,
  VStack
} from '@chakra-ui/react'

import { Select } from 'chakra-react-select'

function CreateRoleModal() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Crear rol
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Crear rol</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack as="form" align="stretch" autoComplete="off">
              <FormControl>
                <FormLabel>Nombre del rol</FormLabel>
                <Input />
              </FormControl>

              <FormControl>
                <FormLabel>Permisos</FormLabel>
                <Select
                  placeholder="Seleccionar permisos..."
                  isMulti
                  options={[
                    { value: 'x', label: 'Permiso X' },
                    { value: 'y', label: 'Permiso Y' },
                    { value: 'z', label: 'Permiso Z' }
                  ]}
                />
              </FormControl>
            </VStack>
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

export default CreateRoleModal
