import { Divider, Flex } from '@chakra-ui/react'
import { Pagination, SearchInput } from 'components'
import { Layout } from 'components/settings'
import CreateRoleModal from 'components/settings/roles/CreateRoleModal'
import RoleList from 'components/settings/roles/RoleList'
import useRoles from 'hooks/useRoles'
import { NextPageWithLayout } from 'pages/_app'

const RoleSettings: NextPageWithLayout = () => {
  const { roles } = useRoles()
  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar roles" />
        <CreateRoleModal />
      </Flex>
      <Divider my={4} />

      <RoleList>
        {roles?.map((r) => (
          <RoleList.Item key={r.id} role={r} />
        ))}
      </RoleList>

      <Pagination />
    </>
  )
}

RoleSettings.getLayout = (page) => <Layout title="Roles">{page}</Layout>

export default RoleSettings
