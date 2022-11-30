import { Divider, Flex, Text } from '@chakra-ui/react'
import { UserStatus } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { EditUserStatusModal } from './EditUserStatusModal'

export const UserStatusItem = ({ userStatus }: { userStatus: UserStatus }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" justifyContent="space-between">
      <Flex justify="space-between">
        <Text fontWeight="bold">{userStatus.status}</Text>
        {user?.permissions.includes('EDIT_USERSTATUS') && (
          <EditUserStatusModal userStatus={userStatus} />
        )}
      </Flex>

      <Divider my={2} />

      <Text>{userStatus.description}</Text>
    </SimpleBox>
  )
}
