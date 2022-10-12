import { Box, Heading } from '@chakra-ui/react'
import { Role } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { EditRoleModal } from './EditRoleModal'

export const RoleItem = ({ role }: { role: Role }) => (
  <SimpleBox as="li" pos="relative">
    <EditRoleModal />
    <Heading as="h2" size="sm" mb={2}>
      {role.name}
    </Heading>
    <Box as="ul" listStylePos="inside">
      <li>Puede hacer de todo</li>
      <li>Y un par de cosas más</li>
      <li>Como X, Y y Z</li>
    </Box>
  </SimpleBox>
)
