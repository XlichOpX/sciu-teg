import { Button, ButtonProps } from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

const SaveButton = (props: ButtonProps) => (
  <Button colorScheme="blue" leftIcon={<FaSave />} {...props}>
    {props.children ?? 'Guardar'}
  </Button>
)

export default SaveButton
