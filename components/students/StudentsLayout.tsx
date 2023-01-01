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
import { getStudents } from 'services/students'
import { StudentWithPersonCareerAndStatus } from 'types/student'

export const StudentsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [students, setStudents] = useState<StudentWithPersonCareerAndStatus[]>()
  const { onClose } = useDisclosure({ onClose: () => setStudents(undefined) })
  const toast = useToast()

  return (
    <BaseLayout>
      <Head>
        <title>Estudiantes</title>
      </Head>
      <HeadingWithSearch
        title="Estudiantes"
        placeholder="Número de documento"
        onSubmit={async ({ text }) => {
          const { result: students } = await getStudents({ keyword: text })
          if (students.length === 0) {
            toast({ status: 'error', description: 'No se encontró ningún estudiante' })
            router.push('/estudiantes')
          } else if (students.length === 1) {
            router.push(`/estudiantes/${students[0].id}`)
          } else {
            setStudents(students)
          }
        }}
      />
      {children}
      <Modal isOpen={Boolean(students)} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Estudiantes encontrados</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box as="ul" listStyleType="none">
              {students?.map((student, index) => (
                <Box
                  as="li"
                  key={student.id}
                  borderBottom={index !== students.length - 1 ? '1px' : undefined}
                  _dark={{ borderBottomColor: 'whiteAlpha.200' }}
                  _light={{ borderBottomColor: 'blackAlpha.200' }}
                >
                  <NLink href={`/estudiantes/${student.id}`}>
                    <Box
                      as="span"
                      h="full"
                      display="block"
                      py={1}
                      _dark={{ _hover: { bgColor: 'whiteAlpha.200' } }}
                      _light={{ _hover: { bgColor: 'blue.50' } }}
                      onClick={onClose}
                    >
                      {student.person.firstName} {student.person.firstLastName} -{' '}
                      {student.person.docType.type}: {student.person.docNumber} |{' '}
                      {student.status.status}
                    </Box>
                  </NLink>
                </Box>
              ))}
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
