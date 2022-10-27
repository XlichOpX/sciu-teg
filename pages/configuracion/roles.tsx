import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateRoleModal, RoleList } from 'components/settings/roles'
import { useRoles } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const RoleSettings: NextPageWithLayout = () => {
  const { roles, error, isLoading } = useRoles()

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar roles" />
        <CreateRoleModal />
      </Flex>

      <Divider my={4} />

      {error && <Alert status="error">{error.message}</Alert>}
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
