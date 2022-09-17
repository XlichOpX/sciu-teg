import { SimpleGrid } from '@chakra-ui/react'
import RoleItem from './RoleItem'

function RoleList() {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" spacing={4}>
      {Array(4)
        .fill(1)
        .map((_, i) => (
          <RoleItem key={i} />
        ))}
    </SimpleGrid>
  )
}

export default RoleList
