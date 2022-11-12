import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { UserEssencials } from 'types/user'
import { EditUserModal } from './EditUserModal'

export const UserItem = ({ user }: { user: UserEssencials }) => {
  const { user: currentUser } = useAuth()

  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{user.username}</Text>
      {currentUser?.permissions.includes('EDIT_USER') && <EditUserModal user={user} />}
    </SimpleBox>
  )
}
