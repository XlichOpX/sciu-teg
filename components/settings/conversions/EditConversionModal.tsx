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
import { Conversion } from '@prisma/client'
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { conversionKeysMatcher, useMatchMutate } from 'hooks'
import { useState } from 'react'
import { deleteConversion, updateConversion } from 'services/conversions'
import { ConversionForm, ConversionFormSubmitHandler } from './ConversionForm'

export const EditConversionModal = ({
  conversion: { id, date, ...defaultValues }
}: {
  conversion: Conversion
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()

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
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al eliminar la tasa de cambio' })
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
          <ModalHeader>
            <h3>Editar tasa de cambio</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ConversionForm
              id="EditConversionForm"
              onSubmit={onUpdate}
              defaultValues={defaultValues}
            />
          </ModalBody>

          <ModalFooter>
            <DeleteButton
              mr="auto"
              onDelete={onDelete}
              confirmBody="¿Está seguro de eliminar esta tasa de cambio?"
              disabled={isSubmitting}
            />
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="EditConversionForm" disabled={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
