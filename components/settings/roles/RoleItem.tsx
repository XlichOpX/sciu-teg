import { Heading, Text } from '@chakra-ui/react'
import { Role } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { EditRoleModal } from './EditRoleModal'

export const RoleItem = ({ role }: { role: Role }) => {
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
