import { Divider, Flex } from '@chakra-ui/react'
import { SearchInput } from 'components'
import { Layout } from 'components/settings'
import CreateUserModal from 'components/settings/users/CreateUserModal'
import UserList from 'components/settings/users/UserList'
import { NextPageWithLayout } from 'pages/_app'

const UsersSettings: NextPageWithLayout = () => {
  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput w="auto" placeholder="Buscar usuarios" />
        <CreateUserModal />
      </Flex>

      <Divider my={4} />

      <UserList />
    </>
  )
}

UsersSettings.getLayout = (page) => <Layout title="Usuarios">{page}</Layout>

export default UsersSettings
