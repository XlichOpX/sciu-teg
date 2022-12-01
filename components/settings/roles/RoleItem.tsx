import { Flex, Heading, Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { RoleWithPermissions } from 'types/role'
import { EditRoleModal } from './EditRoleModal'

export const RoleItem = ({ role }: { role: RoleWithPermissions }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" pos="relative">
      <Flex justifyContent="space-between">
        <Heading as="h2" size="sm" mb={2}>
          {role.name}
        </Heading>
        {user?.permissions.includes('EDIT_ROLE') && <EditRoleModal role={role} />}
      </Flex>
      <Text>{role.description}</Text>
    </SimpleBox>
  )
}
