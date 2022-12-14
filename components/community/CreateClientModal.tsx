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
import { HttpError } from 'lib/http-error'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { createClient } from 'services/clients'
import { ClientForm, ClientFormSubmitHandler } from './ClientForm'

export const CreateClientModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleSubmit: ClientFormSubmitHandler = async (data) => {
    setIsLoading(true)
    try {
      const newClient = await createClient(data)
      router.push(`/comunidad/${newClient.id}`)
      toast({ status: 'success', description: 'Cliente creado' })
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CreateButton onClick={onOpen}>Registrar cliente</CreateButton>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar cliente</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ClientForm id="CreateClientForm" onSubmit={handleSubmit} />
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />

            <SaveButton type="submit" form="CreateClientForm" isLoading={isLoading}>
              Registrar cliente
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
