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
import { productKeysMatcher, useMatchMutate } from 'hooks'
import { HttpError } from 'lib/http-error'
import { useForm } from 'react-hook-form'
import { productSchema } from 'schema/productSchema'
import { createProduct } from 'services/products'
import type { ProductInput } from 'types/product'
import { ProductForm, ProductFormSubmitHandler } from './ProductForm'

export const CreateProductModal = () => {
  const matchMutate = useMatchMutate()
  const toast = useToast()

  const formHook = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { stock: -1 }
  })

  const { isOpen, onClose, onOpen } = useDisclosure({ onClose: () => formHook.reset() })

  const handleSubmit: ProductFormSubmitHandler = async (data) => {
    try {
      await createProduct(data)
      await matchMutate(productKeysMatcher)
      toast({ status: 'success', description: 'Producto creado' })
      onClose()
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      }
    }
  }

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
            <ProductForm formHook={formHook} id="CreateProductForm" onSubmit={handleSubmit} />
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose} mr={3} />
            <SaveButton
              colorScheme="blue"
              type="submit"
              form="CreateProductForm"
              disabled={formHook.formState.isSubmitting}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
