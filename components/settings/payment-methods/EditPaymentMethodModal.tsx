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
import { paymentMethodKeysMatcher, useMatchMutate } from 'hooks'
import { useForm } from 'react-hook-form'
import { paymentMethodInputSchema } from 'schema/paymentMethodSchema'
import { deletePaymentMethod, updatePaymentMethod } from 'services/paymentMethods'
import { MetaPayment, PaymentMethodInput, PaymentMethodWithConversion } from 'types/paymentMethod'
import { PaymentMethodForm, PaymentMethodFormSubmitHandler } from './PaymentMethodForm'

export const EditPaymentMethodModal = ({
  paymentMethod
}: {
  paymentMethod: PaymentMethodWithConversion
}) => {
  const formHook = useForm<PaymentMethodInput>({
    resolver: zodResolver(paymentMethodInputSchema),
    defaultValues: { ...paymentMethod, metaPayment: paymentMethod.metaPayment as MetaPayment }
  })

  const { onOpen, isOpen, onClose } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onUpdate: PaymentMethodFormSubmitHandler = async (data: PaymentMethodInput) => {
    try {
      await updatePaymentMethod(paymentMethod.id, data)
      await matchMutate(paymentMethodKeysMatcher)
      toast({ status: 'success', description: 'Método de pago actualizado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el método de pago' })
    }
  }

  const onDelete = async () => {
    try {
      await deletePaymentMethod(paymentMethod.id)
      await matchMutate(paymentMethodKeysMatcher)
      toast({ status: 'success', description: 'Método de pago eliminado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'No se pudo eliminar el método de pago' })
    }
  }

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
            <PaymentMethodForm
              id="EditPaymentMethodForm"
              formHook={formHook}
              onSubmit={onUpdate}
              resetOnSubmit={false}
            />
          </ModalBody>

          <ModalFooter>
            <DeleteButton
              confirmBody="¿Está seguro de eliminar este método de pago?"
              onDelete={onDelete}
              mr="auto"
            />
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton
              type="submit"
              form="EditPaymentMethodForm"
              disabled={formHook.formState.isSubmitting}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
