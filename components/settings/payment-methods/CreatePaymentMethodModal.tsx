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
import { paymentMethodKeysMatcher, useMatchMutate } from 'hooks'
import { useForm } from 'react-hook-form'
import { paymentMethodCreateSchema } from 'schema/paymentMethodSchema'
import { createPaymentMethod } from 'services/paymentMethods'
import { PaymentMethodCreateInput } from 'types/paymentMethod'
import { PaymentMethodForm, PaymentMethodFormSubmitHandler } from './PaymentMethodForm'

export const CreatePaymentMethodModal = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()
  const formHook = useForm<PaymentMethodCreateInput>({
    resolver: zodResolver(paymentMethodCreateSchema)
  })

  const onSubmit: PaymentMethodFormSubmitHandler = async (data: PaymentMethodCreateInput) => {
    try {
      await createPaymentMethod(data)
      await matchMutate(paymentMethodKeysMatcher)
      toast({ status: 'success', description: 'Método de pago creado' })
      onClose()
    } catch (error) {
      toast({ status: 'error', description: 'Ocurrió un error al crear el método de pago' })
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Crear método de pago</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Crear método de pago</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <PaymentMethodForm
              id="CreatePaymentMethodForm"
              formHook={formHook}
              onSubmit={onSubmit}
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton
              type="submit"
              form="CreatePaymentMethodForm"
              disabled={formHook.formState.isSubmitting}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
