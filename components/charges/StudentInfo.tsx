import { Button, Divider, Flex } from '@chakra-ui/react'
import { BsFileText } from 'react-icons/bs'

function StudentInfo() {
  return (
    <>
      <Flex gap={4} wrap="wrap" justifyContent="space-between" alignItems="center">
        <p>*Información del estudiante*</p>
        <Button leftIcon={<BsFileText />}>Ver recibos</Button>
      </Flex>
      <Divider my={4} />
    </>
  )
}

export default StudentInfo
