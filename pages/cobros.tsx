import { HeadingWithSearch } from 'components'
import { Actions, MonthlyPayments, StudentInfo } from 'components/charges'
import { NextPage } from 'next'
import Head from 'next/head'

const Charges: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cobros</title>
      </Head>

      <HeadingWithSearch title="Cobros" placeholder="Cédula" />

      <StudentInfo />

      <MonthlyPayments />

      <Actions />
    </>
  )
}

export default Charges
