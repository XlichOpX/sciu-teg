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
import { roleKeysMatcher, useMatchMutate } from 'hooks'
import { createRole } from 'services/roles'
import { RoleForm, RoleFormSubmitHandler } from './RoleForm'

export const CreateRoleModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: RoleFormSubmitHandler = async (data) => {
    const permissions = data.permissions.map((p) => ({ id: p.value }))
    try {
      await createRole({ ...data, permissions: { connect: permissions } })
      await matchMutate(roleKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Rol creado' })
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al crear el rol' })
    }
  }

  return (
    <>
      <CreateButton colorScheme="blue" onClick={onOpen}>
        Crear rol
      </CreateButton>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear rol</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <RoleForm id="CreateRoleForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="CreateRoleForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
