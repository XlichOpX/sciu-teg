import { Button, ButtonProps } from '@chakra-ui/react'
import { ComponentRef, forwardRef } from 'react'
import { BsXLg } from 'react-icons/bs'

export const CancelButton = forwardRef<ComponentRef<'button'>, ButtonProps>((props, ref) => (
  <Button leftIcon={<BsXLg />} ref={ref} {...props}>
    {props.children ?? 'Cancelar'}
  </Button>
))

CancelButton.displayName = 'CancelButton'
