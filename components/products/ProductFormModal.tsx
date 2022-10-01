import {
  Button,
  ButtonProps,
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
import React, { ReactElement, useId } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { productSchema } from 'schema/productSchema'
import type { ProductInput } from 'types/product'
import ProductForm from './ProductForm'

function ProductFormModal({
  defaultValues,
  onSubmit,
  trigger,
  title,
  confirmText
}: {
  defaultValues?: ProductInput
  onSubmit: SubmitHandler<ProductInput>
  trigger: ReactElement<ButtonProps>
  title: string
  confirmText: string
}) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const formId = useId()

  const formHook = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues
  })

  return (
    <>
      {React.cloneElement(trigger, { onClick: onOpen })}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>{title}</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ProductForm
              formHook={formHook}
              id={formId}
              onSubmit={async (data) => {
                onSubmit(data)
                onClose()
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form={formId}
              disabled={formHook.formState.isSubmitting}
            >
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProductFormModal
