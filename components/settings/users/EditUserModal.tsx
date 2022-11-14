import {
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
  Select,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select as RSelect } from 'chakra-react-select'
import {
  CancelButton,
  DeleteButton,
  EditButton,
  FullyCenteredSpinner,
  SaveButton
} from 'components/app'
import { useAuth, useMatchMutate, userKeysMatcher, useRoles, useUserStatus } from 'hooks'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { userUpdateSchema } from 'schema/userSchema'
import { deleteUser, updateUser } from 'services/users'
import { UserEssencials } from 'types/user'
import { z } from 'zod'

type EditUserForm = z.infer<typeof userUpdateSchema>

export const EditUserModal = ({ user }: { user: UserEssencials }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { selectOptions } = useRoles()
  const { userStatus } = useUserStatus()
  const { user: currentUser } = useAuth()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register
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

  const onDelete = async () => {
    try {
      await deleteUser(user.id)
      await matchMutate(userKeysMatcher)
      toast({ status: 'success', description: 'Usuario eliminado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al eliminar el usuario' })
    }
  }

  const isLoading = !userStatus || !selectOptions

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
            {isLoading ? (
              <FullyCenteredSpinner />
            ) : (
              <Stack
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                id="EditUserForm"
                gap={3}
                noValidate
              >
                <FormControl isInvalid={!!errors.statusId} isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    defaultValue={user.status.id}
                    {...register('statusId', { valueAsNumber: true })}
                  >
                    {userStatus.map((us) => (
                      <option key={us.id} value={us.id}>
                        {us.status}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.statusId?.message}</FormErrorMessage>
                </FormControl>

                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.roles} isRequired>
                      <FormLabel>Roles</FormLabel>
                      <RSelect
                        {...field}
                        onChange={(newValue) => field.onChange(newValue.map((nv) => nv.value))}
                        value={selectOptions?.filter((so) => field.value.includes(so.value))}
                        isMulti
                        options={selectOptions}
                        placeholder="Seleccionar roles..."
                        noOptionsMessage={({ inputValue }) => `Sin resultados para "${inputValue}"`}
                      />
                      <FormErrorMessage>{errors.roles?.message}</FormErrorMessage>
                    </FormControl>
                  )}
                />
              </Stack>
            )}
          </ModalBody>

          <ModalFooter>
            {currentUser?.permissions.includes('DELETE_USER') && currentUser.id !== user.id && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar este usuario?"
                onDelete={onDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />

            <SaveButton type="submit" form="EditUserForm" isLoading={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
