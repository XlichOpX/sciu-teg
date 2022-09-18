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
  StackDivider,
  useDisclosure,
  VStack
} from '@chakra-ui/react'

import { Select } from 'chakra-react-select'

function CreateUserModal() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Crear usuario
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Crear usuario</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack as="form" align="stretch" divider={<StackDivider />} autoComplete="off">
              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormLabel>Contraseña</FormLabel>
                  <Input type="password" autoComplete="new-password" />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Pregunta #1</FormLabel>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormLabel>Respuesta</FormLabel>
                  <Input type="password" />
                </FormControl>

                <FormControl>
                  <FormLabel>Pregunta #2</FormLabel>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormLabel>Respuesta</FormLabel>
                  <Input type="password" />
                </FormControl>

                <FormControl>
                  <FormLabel>Pregunta #3</FormLabel>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormLabel>Respuesta</FormLabel>
                  <Input type="password" />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Roles</FormLabel>
                <Select
                  placeholder="Seleccionar roles..."
                  isMulti
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'plebeyo', label: 'Plebeyo' },
                    { value: 'don-nadie', label: 'Don Nadie' }
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

export default CreateUserModal
