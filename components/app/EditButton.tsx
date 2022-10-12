import { Button, ButtonProps, VisuallyHidden } from '@chakra-ui/react'
import { BsPencilFill } from 'react-icons/bs'

export const EditButton = (props: ButtonProps) => (
  <Button variant="ghost" size="xs" {...props}>
    <VisuallyHidden>Editar</VisuallyHidden>
    <BsPencilFill />
  </Button>
)
