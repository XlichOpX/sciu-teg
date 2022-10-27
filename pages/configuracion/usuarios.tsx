import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateUserModal, UserList } from 'components/settings/users'
import { useUsers } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const UsersSettings: NextPageWithLayout = () => {
  const { users, error, setSearch, isLoading } = useUsers()

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar usuarios" onChange={({ text }) => setSearch(text)} />
        <CreateUserModal />
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={3}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <UserList>
        {users?.map((u) => (
          <UserList.Item key={u.id} user={u} />
        ))}
      </UserList>
    </>
  )
}

UsersSettings.getLayout = (page) => <SettingsLayout title="Usuarios">{page}</SettingsLayout>

export default UsersSettings
