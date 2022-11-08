import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateRoleModal, RoleList } from 'components/settings/roles'
import { useAuth, useRoles } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const RoleSettings: NextPageWithLayout = () => {
  const { roles, error, isLoading, setSearch } = useRoles()

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_ROLE')) {
    return <Alert status="error">No tiene permiso para ver los roles</Alert>
  }

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar roles" onChange={({ text }) => setSearch(text)} />
        {user?.permissions.includes('CREATE_ROLE') && <CreateRoleModal />}
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <RoleList>
        {roles?.map((r) => (
          <RoleList.Item key={r.id} role={r} />
        ))}
      </RoleList>
    </>
  )
}

RoleSettings.getLayout = (page) => <SettingsLayout title="Roles">{page}</SettingsLayout>

export default RoleSettings
