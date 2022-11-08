import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CareerList, CreateCareerModal } from 'components/settings/careers'
import { useAuth, useCareers } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const CareerSettings: NextPageWithLayout = () => {
  const { careers, error, isLoading, setSearch } = useCareers()
  const { user } = useAuth()

  if (user && !user.permissions.includes('READ_CAREER')) {
    return <Alert status="error">No tiene permiso para acceder a esta interfaz</Alert>
  }

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar carreras" onChange={({ text }) => setSearch(text)} />
        {user?.permissions.includes('CREATE_CAREER') && <CreateCareerModal />}
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <CareerList>
        {careers?.map((r) => (
          <CareerList.Item key={r.id} career={r} />
        ))}
      </CareerList>
    </>
  )
}

CareerSettings.getLayout = (page) => <SettingsLayout title="Carreras">{page}</SettingsLayout>

export default CareerSettings
