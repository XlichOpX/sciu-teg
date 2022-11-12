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
import { careerKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { SubmitHandler } from 'react-hook-form'
import { careerUpdateSchema } from 'schema/careerSchema'
import { deleteCareer, updateCareer } from 'services/careers'
import { Career } from 'types/career'
import { z } from 'zod'
import { CareerForm } from './CareerForm'

type EditCareerForm = z.infer<typeof careerUpdateSchema>

export const EditCareerModal = ({ career }: { career: Career }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()
  const { user } = useAuth()

  const onSubmit: SubmitHandler<EditCareerForm> = async (data) => {
    try {
      await updateCareer(career.id, data)
      await matchMutate(careerKeysMatcher)
      toast({ status: 'success', description: 'Carrera actualizada' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar la carrera' })
    }
  }

  const onDelete = async () => {
    try {
      await deleteCareer(career.id)
      await matchMutate(careerKeysMatcher)
      toast({ status: 'success', description: 'Carrera eliminada' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al eliminar la carrera' })
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar carrera: {career.career}</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CareerForm onSubmit={onSubmit} id="EditCareerForm" defaultValues={career} />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_CAREER') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar esta carrera?"
                onDelete={onDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />

            <SaveButton type="submit" form="EditCareerForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
