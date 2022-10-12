import { Divider, Flex } from '@chakra-ui/react'
import { SearchInput } from 'components/app'
import { Layout } from 'components/settings'
import CreateUserModal from 'components/settings/users/CreateUserModal'
import UserList from 'components/settings/users/UserList'
import useUsers from 'hooks/useUsers'
import { NextPageWithLayout } from 'pages/_app'

const UsersSettings: NextPageWithLayout = () => {
  const { users, setSearch } = useUsers()

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar usuarios" onChange={({ text }) => setSearch(text)} />
        <CreateUserModal />
      </Flex>

      <Divider my={4} />

      <UserList>
        {users?.map((u) => (
          <UserList.Item key={u.id} user={u} />
        ))}
      </UserList>
    </>
  )
}

UsersSettings.getLayout = (page) => <Layout title="Usuarios">{page}</Layout>

export default UsersSettings
