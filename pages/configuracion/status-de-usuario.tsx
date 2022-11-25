import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateUserStatusModal, UserStatusList } from 'components/settings/user-status'
import { useAuth, useUserStatus } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const UserStatusSettings: NextPageWithLayout = () => {
  const { userStatus, error, isLoading, setSearch } = useUserStatus()

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_USERSTATUS')) {
    return <Alert status="error">No tiene permiso para ver los status de usuario</Alert>
  }

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput
          placeholder="Buscar status de usuario"
          onChange={({ text }) => setSearch(text)}
        />
        {user?.permissions.includes('CREATE_USERSTATUS') && <CreateUserStatusModal />}
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <UserStatusList>
        {userStatus?.map((r) => (
          <UserStatusList.Item key={r.id} userStatus={r} />
        ))}
      </UserStatusList>
    </>
  )
}

UserStatusSettings.getLayout = (page) => (
  <SettingsLayout title="Status de Usuarios">{page}</SettingsLayout>
)

export default UserStatusSettings
