import { HeadingWithSearch } from 'components/app'
import { BaseLayout } from 'components/layouts'
import { ReceiptList } from 'components/receipts'
import { useReceipts } from 'hooks'
import Head from 'next/head'
import { NextPageWithLayout } from '../_app'

const Receipts: NextPageWithLayout = () => {
  const { receipts } = useReceipts()
  return (
    <>
      <Head>
        <title>Recibos</title>
      </Head>

      <HeadingWithSearch title="Recibos" placeholder="Buscar recibos" />

      {receipts && <ReceiptList receipts={receipts} />}
    </>
  )
}

Receipts.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Receipts
