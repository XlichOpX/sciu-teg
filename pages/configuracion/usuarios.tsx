import { Heading } from '@chakra-ui/react'
import { BaseLayout } from 'components'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const UsersSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">Usuarios</Heading>
    </>
  )
}

UsersSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default UsersSettings
