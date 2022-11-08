import { Alert, Divider } from '@chakra-ui/react'
import { SettingsLayout } from 'components/settings'
import { ColorModeSwitch, InstituteDataForm } from 'components/settings/general'
import { useAuth } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const GeneralSettings: NextPageWithLayout = () => {
  const { user } = useAuth()

  if (!user?.permissions.includes('READ_PARAMETER')) {
    return <Alert status="error">No tiene permiso para ver los parámetros generales</Alert>
  }

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
