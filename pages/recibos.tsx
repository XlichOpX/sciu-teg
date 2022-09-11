import { HeadingWithSearch } from 'components'
import { ReceiptList } from 'components/receipts'
import { NextPage } from 'next'
import Head from 'next/head'

const Receipts: NextPage = () => {
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

export default Receipts
