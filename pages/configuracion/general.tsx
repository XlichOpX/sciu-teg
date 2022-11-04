import { Divider } from '@chakra-ui/react'
import { SettingsLayout } from 'components/settings'
import { ColorModeSwitch, InstituteDataForm } from 'components/settings/general'
import { NextPageWithLayout } from 'pages/_app'

const GeneralSettings: NextPageWithLayout = () => {
  return (
    <>
      <InstituteDataForm />

      <Divider my={3} />

      <ColorModeSwitch />
    </>
  )
}

GeneralSettings.getLayout = (page) => <SettingsLayout title="General">{page}</SettingsLayout>

export default GeneralSettings
