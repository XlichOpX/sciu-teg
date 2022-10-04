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
import { CancelButton, CreateButton, SaveButton } from 'components'
import { useId } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { productSchema } from 'schema/productSchema'
import type { ProductInput } from 'types/product'
import ProductForm from './ProductForm'

function CreateProductModal({ onSubmit }: { onSubmit: SubmitHandler<ProductInput> }) {
  const formId = useId()

  const formHook = useForm<ProductInput>({
    resolver: zodResolver(productSchema)
  })

  const { isOpen, onClose, onOpen } = useDisclosure({ onClose: () => formHook.reset() })
  return (
    <>
      <CreateButton onClick={onOpen}>Crear producto</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Crear producto</h2>
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
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose} mr={3} />
            <SaveButton
              colorScheme="blue"
              type="submit"
              form={formId}
              disabled={formHook.formState.isSubmitting}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateProductModal
