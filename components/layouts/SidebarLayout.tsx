import { chakra, Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const SidebarLayout = ({
  children,
  sidebar
}: {
  children: ReactNode
  sidebar: ReactNode
}) => (
  <Flex flexDirection={{ base: 'column', md: 'row' }} gap={3}>
    <chakra.div w={{ base: '100%', md: '25%' }}>{sidebar}</chakra.div>
    <chakra.div w={{ base: '100%', md: '75%' }}>{children}</chakra.div>
  </Flex>
)
