import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
import { PaymentMethod } from '@prisma/client'
import { CancelButton } from 'components'
import DeleteButton from 'components/DeleteButton'
import EditButton from 'components/EditButton'
import SaveButton from 'components/SaveButton'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { paymentMethodSchema } from 'schema/paymentMethodSchema'
import { PaymentMethodInput } from 'types/paymentMethod'

function EditPaymentMethodModal({
  paymentMethod,
  onSubmit,
  onDelete
}: {
  paymentMethod: PaymentMethod
  onSubmit: (data: PaymentMethodInput) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<PaymentMethodInput>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: paymentMethod.name
    }
  })
  const formId = useId()

  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <>
      <EditButton onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Editar método de pago</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form
              onSubmit={handleSubmit(async (data) => {
                await onSubmit(data)
                onClose()
              })}
              id={formId}
            >
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nombre</FormLabel>
                <Input {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <DeleteButton
              confirmBody="¿Está seguro de eliminar este método de pago?"
              onDelete={onDelete}
              toastBody="Método de pago eliminado"
              mr="auto"
            />
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form={formId} disabled={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditPaymentMethodModal
