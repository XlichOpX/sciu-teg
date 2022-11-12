import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { useAuth } from 'hooks'
import { useId } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { categorySchema } from 'schema/categorySchema'
import type { CategoryInput } from 'types/category'
import { CategoryForm } from './CategoryForm'

export const EditCategoryModal = ({
  onDelete,
  onSubmit,
  defaultValues
}: {
  onDelete: () => void
  defaultValues: CategoryInput
  onSubmit: SubmitHandler<CategoryInput>
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const formId = useId()
  const { user } = useAuth()

  const formHook = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues
  })

  return (
    <>
      <EditButton pos="absolute" top={4} right={4} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar categoría</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CategoryForm
              formHook={formHook}
              id={formId}
              onSubmit={async (data) => {
                await onSubmit(data)
                onClose()
              }}
            />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_CATEGORY') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar esta categoría?"
                onDelete={onDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form={formId} isLoading={formHook.formState.isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
