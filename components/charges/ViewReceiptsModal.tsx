import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { Pagination } from 'components/app'
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
  const { receipts, page, pages, setPage } = useReceipts({
    itemsPerPage: 15,
    initialSearch: personDocNum
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
          <ModalBody>
            {receipts && (
              <>
                <ReceiptList receipts={receipts} showIdCol={false} />
                <Pagination page={page} pages={pages} setPage={setPage} />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
