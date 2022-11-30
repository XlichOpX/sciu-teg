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
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { categoryKeysMatcher, useMatchMutate } from 'hooks'
import { useForm } from 'react-hook-form'
import { categorySchema } from 'schema/categorySchema'
import { createCategory } from 'services/categories'
import { CategoryInput } from 'types/category'
import { CategoryForm } from './CategoryForm'

export const CreateCategoryModal = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const toast = useToast()

  const formHook = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) })
  const matchMutate = useMatchMutate()

  return (
    <>
      <CreateButton onClick={onOpen}>Crear categoría</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear categoría</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CategoryForm
              id="CreateCategoryForm"
              formHook={formHook}
              onSubmit={async (data) => {
                try {
                  await createCategory(data)
                  await matchMutate(categoryKeysMatcher)
                  toast({ status: 'success', description: 'Categoría creada con éxito' })
                  onClose()
                } catch {
                  toast({ status: 'error', description: 'Ocurrió un error al crear la categoría' })
                }
              }}
              resetOnSubmit
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton
              type="submit"
              form="CreateCategoryForm"
              disabled={formHook.formState.isSubmitting}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
