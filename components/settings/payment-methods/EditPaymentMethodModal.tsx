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
  Input,
  FormErrorMessage
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
  onSubmit: (data: PaymentMethodInput) => Promise<void>
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
            <Button mr="auto" colorScheme="red" variant="outline" title="Eliminar método de pago">
              <BsTrash />
            </Button>

            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <SaveButton type="submit" form={formId} disabled={isSubmitting}>
              Guardar
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditPaymentMethodModal
