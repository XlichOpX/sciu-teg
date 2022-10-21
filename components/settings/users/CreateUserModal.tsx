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
import { useMatchMutate, userKeysMatcher } from 'hooks'
import { useState } from 'react'
import { createUser } from 'services/users'
import { UserForm, UserFormSubmitHandler } from './UserForm'

export const CreateUserModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: UserFormSubmitHandler = async (data) => {
    setIsSubmitting(true)
    try {
      await createUser(data)
      await matchMutate(userKeysMatcher)
      toast({ status: 'success', description: 'Usuario creado con éxito' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al crear el usuario' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <CreateButton colorScheme="blue" onClick={onOpen}>
        Crear usuario
      </CreateButton>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Crear usuario</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <UserForm onSubmit={onCreate} id="CreateUserForm" />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="CreateUserForm" disabled={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
