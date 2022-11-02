import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { ClientForm } from './ClientForm'

export const CreateClientModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <CreateButton onClick={onOpen}>Registrar cliente</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar cliente</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ClientForm id="CreateClientForm" />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />

            <SaveButton type="submit" form="CreateClientForm">
              Registrar cliente
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
