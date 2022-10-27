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
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { SubmitHandler, useForm } from 'react-hook-form'
import { categorySchema } from 'schema/categorySchema'
import { CategoryInput } from 'types/category'
import { CategoryForm } from './CategoryForm'

export const CreateCategoryModal = ({ onSubmit }: { onSubmit: SubmitHandler<CategoryInput> }) => {
  const { onOpen, isOpen, onClose } = useDisclosure()

  const formHook = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) })

  return (
    <>
      <CreateButton onClick={onOpen}>Crear categoría</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Crear categoría</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CategoryForm
              id="CreateCategoryForm"
              formHook={formHook}
              onSubmit={async (data) => {
                await onSubmit(data)
                onClose()
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
