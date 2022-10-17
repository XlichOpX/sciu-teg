import { Alert, Divider } from '@chakra-ui/react'
import { Pagination } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { ConversionList, CreateConversionModal } from 'components/settings/conversions'
import { useConversions } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const ConversionsSettings: NextPageWithLayout = () => {
  const { conversions, error, page, pages, setPage } = useConversions({ itemsPerPage: 21 })
  return (
    <>
      <CreateConversionModal />
      <Divider my={4} />

      <ConversionList>
        {conversions?.map((c) => (
          <ConversionList.Item key={c.id} conversion={c} />
        ))}
      </ConversionList>

      {conversions && <Pagination page={page} pages={pages} setPage={setPage} />}

      {error && (
        <Alert status="error" my={4}>
          {error.message}
        </Alert>
      )}
    </>
  )
}

ConversionsSettings.getLayout = (page) => (
  <SettingsLayout title="Tasas de cambio">{page}</SettingsLayout>
)

export default ConversionsSettings
