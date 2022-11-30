import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { UserStatusItem } from './UserStatusItem'

export const UserStatusList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)

UserStatusList.Item = UserStatusItem
