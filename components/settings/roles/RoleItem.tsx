import { Box, Heading } from '@chakra-ui/react'
import SimpleBox from 'components/SimpleBox'
import EditRoleModal from './EditRoleModal'

function RoleItem() {
  return (
    <SimpleBox as="li" pos="relative">
      <EditRoleModal />
      <Heading as="h2" size="sm" mb={2}>
        Admin
      </Heading>
      <Box as="ul" listStylePos="inside">
        <li>Puede hacer de todo</li>
        <li>Y un par de cosas más</li>
        <li>Como X, Y y Z</li>
      </Box>
    </SimpleBox>
  )
}

export default RoleItem
