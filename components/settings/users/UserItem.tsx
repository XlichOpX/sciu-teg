import { Text } from '@chakra-ui/react'
import { User } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { EditUserModal } from './EditUserModal'

export const UserItem = ({ user }: { user: User }) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">{user.username}</Text>
    <EditUserModal />
  </SimpleBox>
)
