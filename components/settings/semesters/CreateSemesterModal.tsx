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
import { semesterKeysMatcher, useMatchMutate } from 'hooks'
import { createSemester } from 'services/semesters'
import { SemesterForm, SemesterFormSubmitHandler } from './SemesterForm'

export const CreateSemesterModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: SemesterFormSubmitHandler = async (data) => {
    try {
      await createSemester(data)
      await matchMutate(semesterKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Semestre creado' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al crear el semestre' })
      }
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Crear semestre</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear semestre</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SemesterForm id="CreateSemesterForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="CreateSemesterForm">
              Crear semestre
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
