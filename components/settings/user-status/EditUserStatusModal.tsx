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
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { useAuth, useMatchMutate, userStatusKeysMatcher } from 'hooks'
import { HttpError } from 'lib/http-error'
import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { userStatusUpdateSchema } from 'schema/userStatusSchema'
import { deleteUserStatus, updateUserStatus } from 'services/userStatus'
import { UserStatus } from 'types/userStatus'
import { z } from 'zod'
import { UserStatusForm } from './UserStatusForm'

type EditUserStatusForm = z.infer<typeof userStatusUpdateSchema>

export const EditUserStatusModal = ({ userStatus }: { userStatus: UserStatus }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const matchMutate = useMatchMutate()
  const { user } = useAuth()

  const onSubmit: SubmitHandler<EditUserStatusForm> = async (data) => {
    setIsSubmitting(true)
    try {
      await updateUserStatus(userStatus.id, data)
      await matchMutate(userStatusKeysMatcher)
      toast({ status: 'success', description: 'Status de usuario actualizado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el status de usuario' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    try {
      await deleteUserStatus(userStatus.id)
      await matchMutate(userStatusKeysMatcher)
      toast({ status: 'success', description: 'Status de usuario eliminado' })
      onClose()
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      } else {
        toast({
          status: 'error',
          description: 'Ocurrió un error al eliminar la status de usuario'
        })
        console.error(error)
      }
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar status de usuario: {userStatus.status}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <UserStatusForm
              onSubmit={onSubmit}
              id="EditUserStatusForm"
              defaultValues={userStatus}
            />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_USERSTATUS') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar este status de usuario?"
                onDelete={onDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />

            <SaveButton type="submit" form="EditUserStatusForm" isLoading={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
