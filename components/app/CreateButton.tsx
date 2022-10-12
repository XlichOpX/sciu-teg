import { Button, ButtonProps } from '@chakra-ui/react'
import { BsPlusLg } from 'react-icons/bs'

const CreateButton = (props: ButtonProps) => {
  return (
    <Button colorScheme="blue" leftIcon={<BsPlusLg />} {...props}>
      {props.children}
    </Button>
  )
}

export default CreateButton
