import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { CancelButton, EditButton, SaveButton } from 'components'
import { BsTrash } from 'react-icons/bs'

function EditRoleModal() {
  const { onOpen, isOpen, onClose } = useDisclosure()
  return (
    <>
      <EditButton onClick={onOpen} pos="absolute" top={4} right={4} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Editar rol: Admin</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form>
              <FormControl>
                <FormLabel>Permisos</FormLabel>
                <Select
                  isMulti
                  options={[
                    { value: 'X', label: 'Permiso X' },
                    { value: 'Y', label: 'Permiso Y' },
                    { value: 'Z', label: 'Permiso Z' }
                  ]}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar rol">
              <BsTrash />
            </Button>

            <CancelButton mr={3} onClick={onClose} />
            <SaveButton />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditRoleModal
