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
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { productKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { HttpError } from 'lib/http-error'
import { useForm } from 'react-hook-form'
import { productSchema } from 'schema/productSchema'
import { deleteProduct, updateProduct } from 'services/products'
import type { ProductInput, ProductWithCategory } from 'types/product'
import { ProductForm, ProductFormSubmitHandler } from './ProductForm'

export const EditProductModal = ({ product }: { product: ProductWithCategory }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()
  const { user } = useAuth()

  const formHook = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
  })

  const handleSubmit: ProductFormSubmitHandler = async (data) => {
    try {
      await updateProduct(product.id, data)
      await matchMutate(productKeysMatcher)
      toast({ status: 'success', description: 'Producto actualizado' })
      onClose()
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id)
      await matchMutate(productKeysMatcher)
      toast({ status: 'success', description: 'Producto eliminado' })
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 409) {
          toast({ status: 'error', description: 'El producto se encuentra en uno o más recibos' })
        } else {
          toast({ status: 'error', description: error.message })
        }
      }
    }
  }

  return (
    <>
      <EditButton alignSelf="flex-start" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar producto</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ProductForm
              formHook={formHook}
              id="EditProductForm"
              onSubmit={handleSubmit}
              defaultValues={product}
            />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_PRODUCT') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar este producto?"
                onDelete={handleDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />
            <SaveButton
              type="submit"
              form="EditProductForm"
              disabled={formHook.formState.isSubmitting}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
