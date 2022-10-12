import { Text } from '@chakra-ui/react'
import { User } from '@prisma/client'
import { SimpleBox } from 'components/app'
import EditUserModal from './EditUserModal'

function UserItem({ user }: { user: User }) {
  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{user.username}</Text>
      <EditUserModal />
    </SimpleBox>
  )
}

export default UserItem
