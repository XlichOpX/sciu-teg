import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components'
import EditUserModal from './EditUserModal'

function UserItem() {
  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">Usuario #X</Text>
      <EditUserModal />
    </SimpleBox>
  )
}

export default UserItem
