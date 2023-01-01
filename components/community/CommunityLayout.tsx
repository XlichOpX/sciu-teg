import {
  Box,
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
import { HeadingWithSearch } from 'components/app'
import { BaseLayout } from 'components/layouts'
import Head from 'next/head'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { getClients } from 'services/clients'
import { ClientWithPersonAndOccupation } from 'types/client'

export const CommunityLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [clients, setClients] = useState<ClientWithPersonAndOccupation[]>()
  const { onClose } = useDisclosure({ onClose: () => setClients(undefined) })
  const toast = useToast()

  return (
    <BaseLayout>
      <Head>
        <title>Comunidad</title>
      </Head>
      <HeadingWithSearch
        title="Comunidad"
        placeholder="Número de documento"
        onSubmit={async ({ text }) => {
          const { result: clients } = await getClients({ keyword: text })
          if (clients.length === 0) {
            toast({ status: 'error', description: 'No se encontró ningún cliente' })
            router.push('/comunidad')
          } else if (clients.length === 1) {
            router.push(`/comunidad/${clients[0].id}`)
          } else {
            setClients(clients)
          }
        }}
      />
      {children}
      <Modal isOpen={Boolean(clients)} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Clientes encontrados</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box as="ul" listStyleType="none">
              {clients?.map(
                (
                  {
                    id,
                    person: {
                      firstName,
                      firstLastName,
                      middleName,
                      secondLastName,
                      docType,
                      docNumber
                    }
                  },
                  index
                ) => (
                  <Box
                    as="li"
                    key={id}
                    borderBottom={index !== clients.length - 1 ? '1px' : undefined}
                    _dark={{ borderBottomColor: 'whiteAlpha.200' }}
                    _light={{ borderBottomColor: 'blackAlpha.200' }}
                  >
                    <NLink href={`/comunidad/${id}`}>
                      <Box
                        as="span"
                        h="full"
                        display="block"
                        py={1}
                        _dark={{ _hover: { bgColor: 'whiteAlpha.200' } }}
                        _light={{ _hover: { bgColor: 'blue.50' } }}
                        onClick={onClose}
                      >
                        {firstName} {middleName} {firstLastName} {secondLastName} - {docType.type}:{' '}
                        {docNumber}
                      </Box>
                    </NLink>
                  </Box>
                )
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mx="auto" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </BaseLayout>
  )
}
