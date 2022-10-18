import {
  Button,
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
import { CancelButton, SaveButton } from 'components/app'
import { useMatchMutate } from 'hooks'
import { BsArrowRepeat } from 'react-icons/bs'
import { createConversion } from 'services/conversions'
import { ConversionForm, ConversionFormSubmitHandler } from './ConversionForm'

export const CreateConversionModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const onCreate: ConversionFormSubmitHandler = async (data) => {
    try {
      await createConversion(data)
      await matchMutate('^/api/conversion/*')
      onClose()
      toast({ status: 'success', description: 'Tasa de cambio actualizada' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al crear la tasa de cambio' })
      }
    }
  }

  return (
    <>
      <Button colorScheme="blue" leftIcon={<BsArrowRepeat size={20} />} onClick={onOpen}>
        Actualizar tasa de cambio
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Actualizar tasa de cambio</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ConversionForm id="CreateConversionForm" onSubmit={onCreate} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />
            <SaveButton type="submit" form="CreateConversionForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
