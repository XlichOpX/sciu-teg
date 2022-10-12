import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { RoleItem } from './RoleItem'

export const RoleList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" spacing={4}>
    {children}
  </SimpleGrid>
)

RoleList.Item = RoleItem
