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
import { Permission } from '@prisma/client'
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { roleKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { HttpError } from 'lib/http-error'
import { useState } from 'react'
import { deleteRole, updateRole } from 'services/roles'
import { RoleWithPermissions } from 'types/role'
import { RoleForm, RoleFormSubmitHandler } from './RoleForm'

export const EditRoleModal = ({ role }: { role: RoleWithPermissions }) => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const permissions = role.permissions.map((p: Permission) => ({
    value: p.id,
    label: p.description
  }))
  const defaultValues = { ...role, permissions }

  const matchMutate = useMatchMutate()
  const toast = useToast()

  const onUpdate: RoleFormSubmitHandler = async (data) => {
    const permissions = data.permissions.map((p) => ({ id: p.value }))
    setIsSubmitting(true)
    try {
      await updateRole(role.id, { ...data, permissions: { set: permissions } })
      await matchMutate(roleKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Rol actualizado' })
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el rol' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteRole(role.id)
      await matchMutate(roleKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Rol eliminado' })
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      } else {
        toast({ status: 'error', description: 'Ocurrió un error al actualizar el rol' })
        console.error(error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} pos="absolute" top={4} right={4} />

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar rol: {role.name}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <RoleForm id="EditRoleModal" onSubmit={onUpdate} defaultValues={defaultValues} />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_ROLE') && (
              <DeleteButton
                onDelete={onDelete}
                confirmBody="¿Está seguro de eliminar este rol?"
                disabled={isSubmitting}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="EditRoleModal" isLoading={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
