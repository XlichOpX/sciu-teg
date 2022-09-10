import { Button, Flex } from '@chakra-ui/react'
import { HeadingWithSearch } from 'components'
import { ChargeSelectionModal, MonthlyPayments, StudentInfo } from 'components/charges'
import { NextPage } from 'next'
import Head from 'next/head'
import { BsPlusLg } from 'react-icons/bs'

const Charges: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cobros</title>
      </Head>

      <HeadingWithSearch title="Cobros" placeholder="Cédula" />

      <StudentInfo />

      <MonthlyPayments />

      <Flex justifyContent="space-between" mt={4}>
        <Button leftIcon={<BsPlusLg />}>Otros cobros</Button>
        <ChargeSelectionModal />
      </Flex>
    </>
  )
}

export default Charges
