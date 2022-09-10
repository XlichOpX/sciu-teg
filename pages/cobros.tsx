import { Header, MonthlyPayments, StudentInfo, Actions } from 'components/charges'
import { NextPage } from 'next'
import Head from 'next/head'

const Charges: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cobros</title>
      </Head>

      <Header />

      <StudentInfo />

      <MonthlyPayments />

      <Actions />
    </>
  )
}

export default Charges
