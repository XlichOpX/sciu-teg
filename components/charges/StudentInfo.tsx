import { Divider, Flex } from '@chakra-ui/react'
import { StudentWithPersonCareerAndStatus } from 'types/student'
import { ViewReceiptsModal } from './ViewReceiptsModal'

export const StudentInfo = ({
  student: {
    person: { firstName, middleName, firstLastName, secondLastName, docNumber },
    career: { career },
    status: { status }
  }
}: {
  student: StudentWithPersonCareerAndStatus
}) => (
  <>
    <Flex gap={4} wrap="wrap" justifyContent="space-between" alignItems="center">
      <p>
        Estudiante: {[firstName, middleName, firstLastName, secondLastName].join(' ')} / Cédula:{' '}
        {docNumber} / Carrera: {career} / Estado: {status}
      </p>
      <ViewReceiptsModal />
    </Flex>
    <Divider my={4} />
  </>
)
