import { BaseLayout } from 'components'
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

RoleSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default RoleSettings
