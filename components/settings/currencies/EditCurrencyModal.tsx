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
import { CancelButton, DeleteButton, EditButton, SaveButton } from 'components/app'
import { currencyKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { HttpError } from 'lib/http-error'
import { SubmitHandler } from 'react-hook-form'
import { currencyUpdateSchema } from 'schema/currencySchema'
import { deleteCurrency, updateCurrency } from 'services/currencies'
import { Currency } from 'types/currency'
import { z } from 'zod'
import { CurrencyForm } from './CurrencyForm'

type EditCurrencyForm = z.infer<typeof currencyUpdateSchema>

export const EditCurrencyModal = ({ currency }: { currency: Currency }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()
  const { user } = useAuth()

  const onSubmit: SubmitHandler<EditCurrencyForm> = async (data) => {
    try {
      await updateCurrency(currency.id, data)
      await matchMutate(currencyKeysMatcher)
      toast({ status: 'success', description: 'Moneda actualizada' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar la moneda' })
    }
  }

  const onDelete = async () => {
    try {
      await deleteCurrency(currency.id)
      await matchMutate(currencyKeysMatcher)
      toast({ status: 'success', description: 'Moneda eliminada' })
      onClose()
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      } else {
        console.error(error)
      }
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>
              Editar moneda: {currency.name} - {currency.symbol}
            </h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CurrencyForm onSubmit={onSubmit} id="EditCurrencyForm" defaultValues={currency} />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_CURRENCY') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar este moneda?"
                onDelete={onDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />

            <SaveButton type="submit" form="EditCurrencyForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
