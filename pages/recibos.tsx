import { Header, ReceiptList } from 'components/receipts'
import { NextPage } from 'next'
import Head from 'next/head'

const Receipts: NextPage = () => {
  return (
    <>
      <Head>
        <title>Recibos</title>
      </Head>

      <Header />

      <ReceiptList />
    </>
  )
}

export default Receipts
