import { chakra, Flex, Stack } from '@chakra-ui/react'
import { BsXCircleFill } from 'react-icons/bs'

export const DocErrorList = ({ errors }: { errors: string[] }) => {
  return (
    <Stack as="ul" listStyleType="none">
      {errors.map((e, i) => (
        <chakra.li key={i} _dark={{ color: 'red.300' }} _light={{ color: 'red.400' }}>
          <Flex alignItems="center" gap={2}>
            <BsXCircleFill />
            <p>{e}</p>
          </Flex>
        </chakra.li>
      ))}
    </Stack>
  )
}
