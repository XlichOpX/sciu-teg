import { Header } from 'components/charges'
import { NextPage } from 'next'
import Head from 'next/head'

const Charges: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cobros</title>
      </Head>

      <Header />

      <p>Aquí iría el resto del contenido</p>
    </>
  )
}

export default Charges
