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
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { careerKeysMatcher, useMatchMutate } from 'hooks'
import { createCareer } from 'services/careers'
import { CareerForm, CareerFormSubmitHandler } from './CareerForm'

export const CreateCareerModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: CareerFormSubmitHandler = async (data) => {
    try {
      await createCareer(data)
      await matchMutate(careerKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Carrera creada' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al crear la carrera' })
      }
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Crear carrera</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Crear carrera</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CareerForm id="CreateCareerForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="CreateCareerForm">
              Crear carrera
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
