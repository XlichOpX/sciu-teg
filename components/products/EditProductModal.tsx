import {
  Button,
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
import DeleteButton from 'components/DeleteButton'
import EditButton from 'components/EditButton'
import { useId } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsXLg } from 'react-icons/bs'
import { FaSave } from 'react-icons/fa'
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
            />
          </ModalBody>

          <ModalFooter>
            <DeleteButton
              confirmBody="¿Está seguro de eliminar este producto?"
              toastBody="Producto eliminado"
              onDelete={onDelete}
              mr="auto"
            />

            <Button mr={3} onClick={onClose} leftIcon={<BsXLg />}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form={formId}
              disabled={formHook.formState.isSubmitting}
              leftIcon={<FaSave />}
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProductModal
