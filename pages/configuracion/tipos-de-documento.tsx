import { Alert, Divider, Flex } from '@chakra-ui/react'
import { FullyCenteredSpinner, SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CreateDoctypeModal, DoctypeList } from 'components/settings/doctypes'
import { useDocTypes } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const DoctypeSettings: NextPageWithLayout = () => {
  const { docTypes, error, isLoading, setSearch } = useDocTypes()

  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput
          placeholder="Buscar tipos de documento"
          onChange={({ text }) => setSearch(text)}
        />
        <CreateDoctypeModal />
      </Flex>

      <Divider my={4} />

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}
      {isLoading && <FullyCenteredSpinner />}

      <DoctypeList>
        {docTypes?.map((r) => (
          <DoctypeList.Item key={r.id} doctype={r} />
        ))}
      </DoctypeList>
    </>
  )
}

DoctypeSettings.getLayout = (page) => (
  <SettingsLayout title="Tipos de documento">{page}</SettingsLayout>
)

export default DoctypeSettings
