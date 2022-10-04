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

function EditUserModal() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <EditButton onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar Usuario #X</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form>
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
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar usuario">
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

export default EditUserModal
