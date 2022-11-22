import { Button, Flex, Spinner } from '@chakra-ui/react'
import { ReceiptDetail } from 'components/receipts'
import { useParameters, useReceipt } from 'hooks'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { BsPrinterFill } from 'react-icons/bs'
import { hideOnPrint } from 'utils/hideOnPrint'

const ReceiptPage: NextPage = () => {
  const router = useRouter()
  const { receipt } = useReceipt(Number(router.query.receiptId))
  const { parameters } = useParameters()

  if (!receipt || !parameters)
    return (
      <Flex w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    )

  const print = () => {
    window.print()
  }

  return (
    <>
      <ReceiptDetail parameters={parameters} receipt={receipt} />
      <Button
        my={3}
        mx="auto"
        display="flex"
        colorScheme="blue"
        leftIcon={<BsPrinterFill />}
        onClick={print}
        sx={{ ...hideOnPrint }}
      >
        Imprimir
      </Button>
    </>
  )
}

export default ReceiptPage
