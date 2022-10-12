import {
  Button,
  ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { BsTrash } from 'react-icons/bs'

interface DeleteButtonProps extends ButtonProps {
  onDelete: () => void
  confirmBody: ReactNode
}

const DeleteButton = ({ onDelete, confirmBody, ...props }: DeleteButtonProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  return (
    <Popover onOpen={onOpen} onClose={onClose} isOpen={isOpen}>
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
              onClose()
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
