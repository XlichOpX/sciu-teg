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
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components'
import { useId } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { productSchema } from 'schema/productSchema'
import type { ProductInput } from 'types/product'
import ProductForm from './ProductForm'

function EditProductModal({
  onDelete,
  onSubmit,
  defaultValues
}: {
  onDelete: () => void
  defaultValues: ProductInput
  onSubmit: SubmitHandler<ProductInput>
}) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const formId = useId()

  const formHook = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues
  })

  return (
    <>
      <EditButton alignSelf="flex-start" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar producto</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ProductForm
              formHook={formHook}
              id={formId}
              onSubmit={async (data) => {
                await onSubmit(data)
                onClose()
              }}
              defaultValues={defaultValues}
            />
          </ModalBody>

          <ModalFooter>
            <DeleteButton
              confirmBody="¿Está seguro de eliminar este producto?"
              onDelete={onDelete}
              mr="auto"
            />
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form={formId} disabled={formHook.formState.isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProductModal
