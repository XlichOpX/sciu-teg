import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { FullyCenteredSpinner, Pagination } from 'components/app'
import { ReceiptList } from 'components/receipts'
import { useReceipts } from 'hooks'
import { BsFileText } from 'react-icons/bs'

export const ViewReceiptsModal = ({
  fullName,
  personDocNum
}: {
  fullName: string
  personDocNum: string
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { receipts, page, pages, setPage, isLoading } = useReceipts({
    itemsPerPage: 15,
    initialSearch: personDocNum,
    savePage: false
  })

  return (
    <>
      <Button leftIcon={<BsFileText />} onClick={onOpen}>
        Ver recibos
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recibos de {fullName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {receipts && receipts.length > 0 && (
              <>
                <ReceiptList receipts={receipts} showIdCol={false} />
                <Pagination page={page} pages={pages} setPage={setPage} />
              </>
            )}
            {receipts?.length === 0 && <Alert>No hay recibos...</Alert>}
            {isLoading && <FullyCenteredSpinner />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
