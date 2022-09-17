import { Layout } from 'components/settings'
import RoleList from 'components/settings/roles/RoleList'
import { NextPageWithLayout } from 'pages/_app'

const RoleSettings: NextPageWithLayout = () => {
  return (
    <>
      <RoleList />
    </>
  )
}

RoleSettings.getLayout = (page) => <Layout title="Roles">{page}</Layout>

export default RoleSettings
