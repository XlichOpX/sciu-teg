import { chakra } from '@chakra-ui/react'
import { ComponentPropsWithoutRef } from 'react'

export const Logo = (props: ComponentPropsWithoutRef<typeof chakra.span>) => {
  return <chakra.span {...props}>SCIU</chakra.span>
}
