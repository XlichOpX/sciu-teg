import { Button, ButtonProps, VisuallyHidden } from '@chakra-ui/react'
import { BsPencilFill } from 'react-icons/bs'

function EditButton(props: ButtonProps) {
  return (
    <Button variant="ghost" size="xs" {...props}>
      <VisuallyHidden>Editar</VisuallyHidden>
      <BsPencilFill />
    </Button>
  )
}

export default EditButton
