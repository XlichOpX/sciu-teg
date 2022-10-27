import { Alert, Divider } from '@chakra-ui/react'
import { FullyCenteredSpinner, Pagination } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { ConversionList, CreateConversionModal } from 'components/settings/conversions'
import { useConversions } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const ConversionsSettings: NextPageWithLayout = () => {
  const { conversions, error, page, pages, setPage, isLoading } = useConversions({
    itemsPerPage: 21
  })
  return (
    <>
      <CreateConversionModal />

      <Divider my={4} />

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
