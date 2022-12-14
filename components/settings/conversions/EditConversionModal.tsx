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
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { conversionKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { HttpError } from 'lib/http-error'
import { useState } from 'react'
import { deleteConversion, updateConversion } from 'services/conversions'
import { ConversionWithCurrency } from 'types/conversion'
import { ConversionForm, ConversionFormSubmitHandler } from './ConversionForm'

export const EditConversionModal = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  conversion: { id, date, ...defaultValues }
}: {
  conversion: ConversionWithCurrency
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const { user } = useAuth()

  const matchMutate = useMatchMutate()
  const onUpdate: ConversionFormSubmitHandler = async (data) => {
    setIsSubmitting(true)
    try {
      await updateConversion(id, data)
      await matchMutate(conversionKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Tasa de cambio actualizada' })
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar la tasa de cambio' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteConversion(id)
      await matchMutate(conversionKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Tasa de cambio eliminada' })
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      } else {
        toast({ status: 'error', description: 'Ocurrió un error al eliminar la tasa de cambio' })
        console.error(error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} pos="absolute" top={4} right={4} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar tasa de cambio</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ConversionForm
              id="EditConversionForm"
              onSubmit={onUpdate}
              defaultValues={{ value: defaultValues.value, currencyId: defaultValues.currency.id }}
            />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_CONVERSION') && (
              <DeleteButton
                mr="auto"
                onDelete={onDelete}
                confirmBody="¿Está seguro de eliminar esta tasa de cambio?"
                disabled={isSubmitting}
              />
            )}
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="EditConversionForm" isLoading={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
