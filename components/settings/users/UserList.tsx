import { SimpleGrid } from '@chakra-ui/react'
import UserItem from './UserItem'

function UserList() {
  return (
    <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
      {Array(4)
        .fill(1)
        .map((_, i) => (
          <UserItem key={i} />
        ))}
    </SimpleGrid>
  )
}

export default UserList
