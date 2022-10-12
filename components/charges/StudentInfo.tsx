import { Divider, Flex } from '@chakra-ui/react'
import { ViewReceiptsModal } from './ViewReceiptsModal'

export const StudentInfo = ({
  name,
  docNumber,
  career,
  status
}: {
  name: string
  docNumber: string
  career: string
  status: string
}) => (
  <>
    <Flex gap={4} wrap="wrap" justifyContent="space-between" alignItems="center">
      <p>
        Estudiante: {name} / Cédula: {docNumber} / Carrera: {career} / Estado: {status}
      </p>
      <ViewReceiptsModal />
    </Flex>
    <Divider my={4} />
  </>
)
