import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import RoleItem from './RoleItem'

function RoleList({ children }: { children: ReactNode }) {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" spacing={4}>
      {children}
    </SimpleGrid>
  )
}

RoleList.Item = RoleItem

export default RoleList
