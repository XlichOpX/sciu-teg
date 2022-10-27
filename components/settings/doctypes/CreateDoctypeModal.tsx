import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { doctypeKeysMatcher, useMatchMutate } from 'hooks'
import { createDoctype } from 'services/doctypes'
import { DoctypeForm, DoctypeFormSubmitHandler } from './DoctypeForm'

export const CreateDoctypeModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: DoctypeFormSubmitHandler = async (data) => {
    try {
      await createDoctype(data)
      await matchMutate(doctypeKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Tipo de documento creado' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al crear el tipo de documento' })
      }
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Crear tipo de documento</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Crear tipo de documento</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <DoctypeForm id="CreateDoctypeForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="CreateDoctypeForm">
              Crear tipo de documento
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
