import { Button, Container, Flex, Spinner, useToast } from '@chakra-ui/react'
import { ReceiptDetail } from 'components/receipts'
import { useParameters, useReceipt } from 'hooks'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsEnvelopeFill, BsPrinterFill } from 'react-icons/bs'
import { sendReceiptsByEmail } from 'services/receipts'
import { hideOnPrint } from 'utils/hideOnPrint'

const ReceiptPage: NextPage = () => {
  const router = useRouter()
  const { receipt } = useReceipt(Number(router.query.receiptId))
  const { parameters } = useParameters()
  const [isSending, setIsSending] = useState(false)
  const toast = useToast()

  if (!receipt || !parameters)
    return (
      <Flex w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    )

  const print = () => {
    window.print()
  }

  const sendByEmail = async () => {
    setIsSending(true)
    try {
      await sendReceiptsByEmail([receipt.id])
      toast({ status: 'success', description: 'Correo enviado' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: error.message })
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <ReceiptDetail parameters={parameters} receipt={receipt} />

      <Container maxW="container.lg">
        <Flex my={3} sx={{ ...hideOnPrint }} justifyContent="space-between">
          <Button colorScheme="blue" variant="outline" leftIcon={<BsPrinterFill />} onClick={print}>
            Imprimir
          </Button>

          <Button
            colorScheme="blue"
            leftIcon={<BsEnvelopeFill />}
            onClick={sendByEmail}
            isLoading={isSending}
          >
            Enviar por correo
          </Button>
        </Flex>
      </Container>
    </>
  )
}

export default ReceiptPage
