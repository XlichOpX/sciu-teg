import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { currencyKeysMatcher, useMatchMutate } from 'hooks'
import { createCurrency } from 'services/currencies'
import { CurrencyForm, CurrencyFormSubmitHandler } from './CurrencyForm'

export const CreateCurrencyModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: CurrencyFormSubmitHandler = async (data) => {
    try {
      await createCurrency(data)
      await matchMutate(currencyKeysMatcher)
      onClose()
      toast({ status: 'success', description: 'Moneda creada' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al crear la moneda' })
      }
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Crear moneda</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Crear moneda</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CurrencyForm id="CreateCurrencyForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <SaveButton type="submit" form="CreateCurrencyForm">
              Crear moneda
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
