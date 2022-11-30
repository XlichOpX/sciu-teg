import { Heading, Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { RoleWithPermissions } from 'types/role'
import { EditRoleModal } from './EditRoleModal'

export const RoleItem = ({ role }: { role: RoleWithPermissions }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" pos="relative">
      {user?.permissions.includes('EDIT_ROLE') && <EditRoleModal role={role} />}
      <Heading as="h2" size="sm" mb={2}>
        {role.name}
      </Heading>
      <Text>{role.description}</Text>
    </SimpleBox>
  )
}
