import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentMethod } from '@prisma/client'
import EditButton from 'components/EditButton'
import SaveButton from 'components/SaveButton'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { BsTrash } from 'react-icons/bs'
import { paymentMethodSchema } from 'schema/paymentMethodSchema'
import { PaymentMethodInput } from 'types/paymentMethod'

function EditPaymentMethodModal({
  paymentMethod,
  onSubmit
}: {
  paymentMethod: PaymentMethod
  onSubmit: () => void
}) {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const { handleSubmit, register } = useForm<PaymentMethodInput>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: paymentMethod.name
    }
  })
  const formId = useId()

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
            <form onSubmit={handleSubmit(onSubmit)} id={formId}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input {...register('name')} />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar método de pago">
              <BsTrash />
            </Button>

            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <SaveButton>Guardar</SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditPaymentMethodModal
