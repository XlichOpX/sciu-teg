import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Select } from 'chakra-react-select'
import { CancelButton, EditButton, SaveButton } from 'components/app'
import { useMatchMutate, userKeysMatcher, useRoles } from 'hooks'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BsTrash } from 'react-icons/bs'
import { userUpdateSchema } from 'schema/userSchema'
import { updateUser } from 'services/users'
import { UserEssencials } from 'types/user'
import { z } from 'zod'

type EditUserForm = z.infer<typeof userUpdateSchema>

export const EditUserModal = ({ user }: { user: UserEssencials }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { selectOptions } = useRoles()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<EditUserForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: { roles: user.roles.map((r) => r.id) }
  })

  const onSubmit: SubmitHandler<EditUserForm> = async (data) => {
    try {
      await updateUser(user.id, data)
      await matchMutate(userKeysMatcher)
      toast({ status: 'success', description: 'Usuario actualizado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el usuario' })
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar usuario: {user.username}</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} id="EditUserForm">
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <FormControl isInvalid={!!errors.roles} isRequired>
                    <FormLabel>Roles</FormLabel>
                    <Select
                      {...field}
                      onChange={(newValue) => field.onChange(newValue.map((nv) => nv.value))}
                      value={selectOptions?.filter((so) => field.value.includes(so.value))}
                      isMulti
                      options={selectOptions}
                      placeholder="Seleccionar roles..."
                    />
                    <FormErrorMessage>{errors.roles?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar usuario">
              <BsTrash />
            </Button>

            <CancelButton mr={3} onClick={onClose} />

            <SaveButton type="submit" form="EditUserForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
