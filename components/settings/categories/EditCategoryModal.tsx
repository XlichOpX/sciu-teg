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
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { categoryKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { categorySchema } from 'schema/categorySchema'
import { deleteCategory, updateCategory } from 'services/categories'
import type { CategoryInput } from 'types/category'
import { CategoryForm } from './CategoryForm'

export const EditCategoryModal = ({ category }: { category: Category }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const formId = useId()
  const { user } = useAuth()

  const defaultValues = { name: category.name, description: category.description }

  const formHook = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues
  })

  const matchMutate = useMatchMutate()
  const toast = useToast()

  const handleUpdate = async (data: CategoryInput) => {
    try {
      await updateCategory(category.id, data)
      await matchMutate(categoryKeysMatcher)
      toast({ status: 'success', description: 'Categoría actualizada' })
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al actualizar la categoría' })
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(category.id)
      await matchMutate(categoryKeysMatcher)
      toast({ status: 'success', description: 'Categoría eliminada' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: error.message })
      }
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} flexShrink={0} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar categoría: {category.name}</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CategoryForm formHook={formHook} id={formId} onSubmit={handleUpdate} />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_CATEGORY') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar esta categoría?"
                onDelete={handleDelete}
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
