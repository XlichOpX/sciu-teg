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
import { doctypeKeysMatcher, useAuth, useMatchMutate } from 'hooks'
import { HttpError } from 'lib/http-error'
import { SubmitHandler } from 'react-hook-form'
import { doctypeUpdateSchema } from 'schema/doctypeSchema'
import { deleteDoctype, updateDoctype } from 'services/doctypes'
import { DocType } from 'types/doctype'
import { z } from 'zod'
import { DoctypeForm } from './DoctypeForm'

type EditDoctypeForm = z.infer<typeof doctypeUpdateSchema>

export const EditDoctypeModal = ({ doctype }: { doctype: DocType }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const matchMutate = useMatchMutate()
  const { user } = useAuth()

  const onSubmit: SubmitHandler<EditDoctypeForm> = async (data) => {
    try {
      await updateDoctype(doctype.id, data)
      await matchMutate(doctypeKeysMatcher)
      toast({ status: 'success', description: 'Tipo de documento actualizado' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al actualizar el tipo de documento' })
    }
  }

  const onDelete = async () => {
    try {
      await deleteDoctype(doctype.id)
      await matchMutate(doctypeKeysMatcher)
      toast({ status: 'success', description: 'Tipo de documento eliminado' })
      onClose()
    } catch (error) {
      if (error instanceof HttpError) {
        toast({ status: 'error', description: error.message })
      } else {
        toast({ status: 'error', description: 'Ocurrió un error al eliminar el tipo de documento' })
        console.error(error)
      }
    }
  }

  return (
    <>
      <EditButton onClick={onOpen} flexShrink={0} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Editar tipo de documento: {doctype.type}</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <DoctypeForm onSubmit={onSubmit} id="EditDoctypeForm" defaultValues={doctype} />
          </ModalBody>

          <ModalFooter>
            {user?.permissions.includes('DELETE_DOCTYPE') && (
              <DeleteButton
                confirmBody="¿Está seguro de eliminar este tipo de documento?"
                onDelete={onDelete}
                mr="auto"
              />
            )}

            <CancelButton mr={3} onClick={onClose} />

            <SaveButton type="submit" form="EditDoctypeForm" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
