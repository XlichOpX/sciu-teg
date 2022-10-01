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
import { BsXLg } from 'react-icons/bs'
import { FaSave } from 'react-icons/fa'
import { productSchema } from 'schema/productSchema'
import type { ProductInput } from 'types/product'
import ProductForm from './ProductForm'

function ProductFormModal({
  defaultValues,
  onSubmit,
  trigger,
  title,
  confirmText = 'guardar',
  resetOnSubmit = true
}: {
  defaultValues?: ProductInput
  onSubmit: SubmitHandler<ProductInput>
  trigger: ReactElement<ButtonProps>
  title: string
  confirmText?: string
  resetOnSubmit?: boolean
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
                await onSubmit(data)
                resetOnSubmit && formHook.reset()
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
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProductFormModal
