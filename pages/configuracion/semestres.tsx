import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateSemesterModal, SemesterList } from 'components/settings/semesters'
import { useAuth, useSemesters } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const SemesterSettings: NextPageWithLayout = () => {
  const { semesters, error, isLoading, setSearch } = useSemesters()

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_SEMESTER')) {
    return <Alert status="error">No tiene permiso para ver las semestres</Alert>
  }

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar semestres" onChange={({ text }) => setSearch(text)} />
        {user?.permissions.includes('CREATE_SEMESTER') && <CreateSemesterModal />}
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <SemesterList>
        {semesters?.map((r) => (
          <SemesterList.Item key={r.id} semester={r} />
        ))}
      </SemesterList>
    </>
  )
}

SemesterSettings.getLayout = (page) => <SettingsLayout title="Semestres">{page}</SettingsLayout>

export default SemesterSettings
