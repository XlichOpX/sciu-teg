import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useToast,
  ButtonProps
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { BsTrash } from 'react-icons/bs'

interface DeleteButtonProps extends ButtonProps {
  onDelete: () => void
  confirmBody: ReactNode
  toastBody: ReactNode
}

const DeleteButton = ({ onDelete, confirmBody, toastBody, ...props }: DeleteButtonProps) => {
  const toast = useToast()
  return (
    <Popover>
      <PopoverTrigger>
        <Button {...props} colorScheme="red" variant="outline" title="Eliminar">
          <BsTrash />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirmación</PopoverHeader>
        <PopoverBody>{confirmBody}</PopoverBody>
        <PopoverFooter>
          <Button
            display="block"
            ml="auto"
            colorScheme="red"
            onClick={() => {
              onDelete()
              toast({ status: 'info', description: toastBody })
            }}
          >
            Sí
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

export default DeleteButton
