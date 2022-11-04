import { Alert } from '@chakra-ui/react'
import { FullyCenteredSpinner, HeadingWithSearch, Pagination } from 'components/app'
import { BaseLayout } from 'components/layouts'
import { ReceiptList } from 'components/receipts'
import { useReceipts } from 'hooks'
import Head from 'next/head'
import { NextPageWithLayout } from '../_app'

const Receipts: NextPageWithLayout = () => {
  const { receipts, pages, page, setPage, setSearch, isLoading } = useReceipts({ itemsPerPage: 20 })
  return (
    <>
      <Head>
        <title>Recibos</title>
      </Head>

      <HeadingWithSearch
        title="Recibos"
        placeholder="Buscar recibos"
        onChange={({ text }) => setSearch(text)}
      />
      {isLoading && <FullyCenteredSpinner />}
      {receipts && receipts.length > 0 && <ReceiptList receipts={receipts} />}
      {receipts && receipts.length === 0 && <Alert>No hay recibos...</Alert>}
      {!!pages && pages > 0 && <Pagination page={page} pages={pages} setPage={setPage} />}
    </>
  )
}

Receipts.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Receipts
