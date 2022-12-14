import { Alert, Divider } from '@chakra-ui/react'
import { FullyCenteredSpinner, Pagination } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { ConversionList, CreateConversionModal } from 'components/settings/conversions'
import { useAuth, useConversions } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const ConversionsSettings: NextPageWithLayout = () => {
  const { conversions, error, page, pages, setPage, isLoading } = useConversions({
    itemsPerPage: 21
  })

  const { user } = useAuth()
  if (user && !user.permissions.includes('READ_CONVERSION')) {
    return <Alert status="error">No tiene permiso para ver las tasas de cambio</Alert>
  }

  return (
    <>
      {user?.permissions.includes('CREATE_CONVERSION') && (
        <>
          <CreateConversionModal />
          <Divider my={4} />
        </>
      )}

      {error && (
        <Alert status="error" mb={4}>
          {error.message}
        </Alert>
      )}

      {isLoading && <FullyCenteredSpinner />}

      <ConversionList>
        {conversions?.map((c) => (
          <ConversionList.Item key={c.id} conversion={c} />
        ))}
      </ConversionList>

      {conversions && <Pagination page={page} pages={pages} setPage={setPage} />}
    </>
  )
}

ConversionsSettings.getLayout = (page) => (
  <SettingsLayout title="Tasas de cambio">{page}</SettingsLayout>
)

export default ConversionsSettings
