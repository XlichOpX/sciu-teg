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
import { PaymentMethod } from '@prisma/client'
import { CancelButton } from 'components'
import DeleteButton from 'components/DeleteButton'
import EditButton from 'components/EditButton'
import SaveButton from 'components/SaveButton'
import { useForm } from 'react-hook-form'
import { paymentMethodSchema } from 'schema/paymentMethodSchema'
import { PaymentMethodInput } from 'types/paymentMethod'
import PaymentMethodForm from './PaymentMethodForm'

function EditPaymentMethodModal({
  paymentMethod,
  onSubmit,
  onDelete
}: {
  paymentMethod: PaymentMethod
  onSubmit: (data: PaymentMethodInput) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const formHook = useForm<PaymentMethodInput>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: paymentMethod
  })

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
            <PaymentMethodForm
              id="EditPaymentMethodForm"
              formHook={formHook}
              onSubmit={async (data) => {
                await onSubmit(data)
                onClose()
              }}
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

export default EditPaymentMethodModal
