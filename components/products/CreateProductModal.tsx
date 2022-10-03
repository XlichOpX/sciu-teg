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
import CreateButton from 'components/CreateButton'
import { useId } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsXLg } from 'react-icons/bs'
import { FaSave } from 'react-icons/fa'
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
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateProductModal
