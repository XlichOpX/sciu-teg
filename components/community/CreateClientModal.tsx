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

export const CreateClientModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <CreateButton onClick={onOpen}>Registrar cliente</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar cliente</ModalHeader>
          <ModalCloseButton />

          <ModalBody></ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />

            <SaveButton type="submit" form="CreateCurrencyForm">
              Registrar cliente
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
