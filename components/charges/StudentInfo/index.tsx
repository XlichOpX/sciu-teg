import { Divider, Flex } from '@chakra-ui/react'
import ViewReceiptsModal from './ViewReceiptsModal'

function StudentInfo() {
  return (
    <>
      <Flex gap={4} wrap="wrap" justifyContent="space-between" alignItems="center">
        <p>*Información del estudiante*</p>
        <ViewReceiptsModal />
      </Flex>
      <Divider my={4} />
    </>
  )
}

export default StudentInfo
