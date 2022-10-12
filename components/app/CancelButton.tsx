import { Button, ButtonProps } from '@chakra-ui/react'
import { BsXLg } from 'react-icons/bs'

export const CancelButton = (props: ButtonProps) => (
  <Button leftIcon={<BsXLg />} {...props}>
    {props.children ?? 'Cancelar'}
  </Button>
)
