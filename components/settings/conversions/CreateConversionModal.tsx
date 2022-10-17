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
import { CancelButton, SaveButton } from 'components/app'
import { BsArrowRepeat } from 'react-icons/bs'
import { ConversionForm } from './ConversionForm'

export const CreateConversionModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button colorScheme="blue" leftIcon={<BsArrowRepeat size={20} />} onClick={onOpen}>
        Actualizar tasa de cambio
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Actualizar tasa de cambio</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ConversionForm />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
