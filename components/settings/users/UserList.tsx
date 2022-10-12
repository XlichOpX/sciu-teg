import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { UserItem } from './UserItem'

export const UserList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)

UserList.Item = UserItem
