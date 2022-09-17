import { Heading } from '@chakra-ui/react'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const GeneralSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2">General</Heading>
    </>
  )
}

GeneralSettings.getLayout = (page) => <Layout title="General">{page}</Layout>

export default GeneralSettings
