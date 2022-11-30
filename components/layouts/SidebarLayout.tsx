import { chakra, Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const SidebarLayout = ({
  children,
  sidebar,
  sidebarWidth = '25%'
}: {
  children: ReactNode
  sidebar: ReactNode
  sidebarWidth?: string
}) => (
  <Flex flexDirection={{ base: 'column', md: 'row' }} gap={3}>
    <chakra.div w={{ base: '100%', md: sidebarWidth }}>{sidebar}</chakra.div>
    <chakra.div w={{ base: '100%', md: '75%' }}>{children}</chakra.div>
  </Flex>
)
