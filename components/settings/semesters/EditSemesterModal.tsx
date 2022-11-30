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
import { CancelButton, EditButton, SaveButton } from 'components/app'
import { semesterKeysMatcher, useMatchMutate } from 'hooks'
import { SubmitHandler } from 'react-hook-form'
import { semesterUpdateSchema } from 'schema/semesterSchema'
import { updateSemester } from 'services/semesters'
import { Semester } from 'types/semester'
import { toDateInputString } from 'utils/toDateInputString'
import { z } from 'zod'
import { SemesterForm } from './SemesterForm'

type EditSemesterForm = z.infer<typeof semesterUpdateSchema>

export const EditSemesterModal = ({ semester }: { semester: Semester }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onSubmit: SubmitHandler<EditSemesterForm> = async (data) => {
    try {
      await updateSemester(semester.id, data)
      await matchMutate(semesterKeysMatcher)
      toast({ status: 'success', description: 'Semestre actualizado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el semestre' })
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar semestre: {semester.semester}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SemesterForm
              onSubmit={onSubmit}
              id="EditSemesterForm"
              defaultValues={{
                startDate: toDateInputString(semester.startDate),
                endDate: toDateInputString(semester.endDate)
              }}
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />

            <SaveButton type="submit" form="EditSemesterForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
