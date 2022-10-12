import { HeadingWithSearch } from 'components/app'
import { BaseLayout } from 'components/layouts'
import { ReceiptList } from 'components/receipts'
import Head from 'next/head'
import { NextPageWithLayout } from '../_app'

const Receipts: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Recibos</title>
      </Head>

      <HeadingWithSearch title="Recibos" placeholder="Buscar recibos" />

      <ReceiptList />
    </>
  )
}

Receipts.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Receipts
