import {
  Button,
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
import { CancelButton, EditButton, SaveButton } from 'components/app'
import { roleKeysMatcher, useMatchMutate } from 'hooks'
import { BsTrash } from 'react-icons/bs'
import { updateRole } from 'services/roles'
import { RoleForm, RoleFormSubmitHandler } from './RoleForm'

export const EditRoleModal = ({ role }: { role: any }) => {
  const { onOpen, isOpen, onClose } = useDisclosure()

  const permissions = role.permissions.map((p: Permission) => ({
    value: p.id,
    label: p.description
  }))
  const defaultValues = { ...role, permissions }

  const matchMutate = useMatchMutate()
  const toast = useToast()

  const onUpdate: RoleFormSubmitHandler = async (data) => {
    const permissions = data.permissions.map((p) => ({ id: p.value }))
    try {
      await updateRole(role.id, { ...data, permissions: { set: permissions } })
      await matchMutate(roleKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Rol actualizado' })
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el rol' })
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
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar rol">
              <BsTrash />
            </Button>

            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="EditRoleModal" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
