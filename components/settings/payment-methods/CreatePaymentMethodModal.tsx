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
import { SubmitHandler, useForm } from 'react-hook-form'
import { paymentMethodSchema } from 'schema/paymentMethodSchema'
import { PaymentMethodInput } from 'types/paymentMethod'
import PaymentMethodForm from './PaymentMethodForm'

function CreatePaymentMethodModal({ onSubmit }: { onSubmit: SubmitHandler<PaymentMethodInput> }) {
  const { onOpen, isOpen, onClose } = useDisclosure()

  const formHook = useForm<PaymentMethodInput>({ resolver: zodResolver(paymentMethodSchema) })

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
              onSubmit={async (data) => {
                await onSubmit(data)
                onClose()
              }}
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

export default CreatePaymentMethodModal
