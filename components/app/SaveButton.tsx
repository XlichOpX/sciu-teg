import { Button, ButtonProps } from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

export const SaveButton = (props: ButtonProps) => (
  <Button colorScheme="blue" leftIcon={<FaSave />} {...props}>
    {props.children ?? 'Guardar'}
  </Button>
)
