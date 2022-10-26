import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { UserEssencials } from 'types/user'
import { EditUserModal } from './EditUserModal'

export const UserItem = ({ user }: { user: UserEssencials }) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">{user.username}</Text>
    <EditUserModal user={user} />
  </SimpleBox>
)
