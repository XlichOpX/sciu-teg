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
import { useMatchMutate, userStatusKeysMatcher } from 'hooks'
import { useState } from 'react'
import { createUserStatus } from 'services/userStatus'
import { UserStatusForm, UserStatusFormSubmitHandler } from './UserStatusForm'

export const CreateUserStatusModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: UserStatusFormSubmitHandler = async (data) => {
    setIsSubmitting(true)
    try {
      await createUserStatus(data)
      await matchMutate(userStatusKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Status de usuario creado' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al crear el status de usuario' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Crear status de usuario</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear status de usuario</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <UserStatusForm id="CreateUserStatusForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="CreateUserStatusForm" isLoading={isSubmitting}>
              Crear status de usuario
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
