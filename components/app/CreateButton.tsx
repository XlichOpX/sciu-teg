import { Button, ButtonProps } from '@chakra-ui/react'
import { BsPlusLg } from 'react-icons/bs'

export const CreateButton = (props: ButtonProps) => (
  <Button colorScheme="blue" leftIcon={<BsPlusLg />} {...props}>
    {props.children}
  </Button>
)
