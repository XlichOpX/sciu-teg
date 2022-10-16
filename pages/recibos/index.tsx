import { HeadingWithSearch, Pagination } from 'components/app'
import { BaseLayout } from 'components/layouts'
import { ReceiptList } from 'components/receipts'
import { useReceipts } from 'hooks'
import Head from 'next/head'
import { NextPageWithLayout } from '../_app'

const Receipts: NextPageWithLayout = () => {
  const { receipts, pages, page, setPage } = useReceipts({ itemsPerPage: 20 })
  return (
    <>
      <Head>
        <title>Recibos</title>
      </Head>

      <HeadingWithSearch title="Recibos" placeholder="Buscar recibos" />

      {receipts && <ReceiptList receipts={receipts} />}
      {!!pages && pages > 0 && <Pagination page={page} pages={pages} setPage={setPage} />}
    </>
  )
}

Receipts.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Receipts
