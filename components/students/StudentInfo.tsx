import { Divider, Flex } from '@chakra-ui/react'
import { StudentWithPersonCareerAndStatus } from 'types/student'
import { ViewReceiptsModal } from '../charges/ViewReceiptsModal'

export const StudentInfo = ({
  student: {
    person: { firstName, middleName, firstLastName, secondLastName, docNumber },
    career: { career },
    status: { status }
  }
}: {
  student: StudentWithPersonCareerAndStatus
}) => {
  const fullName = [firstName, middleName, firstLastName, secondLastName].join(' ')
  return (
    <>
      <Flex gap={4} wrap="wrap" justifyContent="space-between" alignItems="center">
        <p>
          Estudiante: {fullName} / Cédula: {docNumber} / Carrera: {career} / Estado: {status}
        </p>
        <ViewReceiptsModal fullName={fullName} personDocNum={docNumber} />
      </Flex>
      <Divider my={4} />
    </>
  )
}
