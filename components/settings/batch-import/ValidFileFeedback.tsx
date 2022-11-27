import { Flex } from '@chakra-ui/react'
import { BsCheckCircleFill } from 'react-icons/bs'

export const ValidFileFeedback = () => {
  return (
    <Flex gap={2} alignItems="center" _dark={{ color: 'green.300' }} _light={{ color: 'green' }}>
      <p>El documento cumple con el formato predefinido</p>
      <BsCheckCircleFill />
    </Flex>
  )
}
