import { Button, Flex } from '@chakra-ui/react'
import { BsPlusLg, BsWalletFill } from 'react-icons/bs'

function Actions() {
  return (
    <Flex justifyContent="space-between" mt={4}>
      <Button leftIcon={<BsPlusLg />}>Otros cobros</Button>
      <Button leftIcon={<BsWalletFill />} colorScheme="blue">
        Cobrar selección
      </Button>
    </Flex>
  )
}

export default Actions
