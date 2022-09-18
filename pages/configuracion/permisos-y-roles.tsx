import { Heading } from '@chakra-ui/react'
import { BaseLayout } from 'components'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const PermissionsRolesSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">Permisos y Roles</Heading>
    </>
  )
}

PermissionsRolesSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default PermissionsRolesSettings
