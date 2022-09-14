import { Heading } from '@chakra-ui/react'
import { BaseLayout } from 'components'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const GeneralSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">General</Heading>
    </>
  )
}

GeneralSettings.getLayout = (page) => (
  <BaseLayout>
    <Layout>{page}</Layout>
  </BaseLayout>
)

export default GeneralSettings
