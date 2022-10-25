import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { useAuth } from 'hooks'
import { ComponentRef, useRef, useState } from 'react'
import { MdLogout } from 'react-icons/md'
import { CancelButton } from './CancelButton'

export const LogoutButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logout } = useAuth()
  const cancelRef = useRef<ComponentRef<'button'>>(null)

  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Button title="Cerrar sesión" onClick={onOpen} variant="ghost">
        <MdLogout />
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cerrar sesión
            </AlertDialogHeader>

            <AlertDialogBody>¿Realmente desea cerrar la sesión?</AlertDialogBody>

            <AlertDialogFooter>
              <CancelButton ref={cancelRef} onClick={onClose} mr="auto" />

              <Button
                colorScheme="red"
                onClick={async () => {
                  setIsLoading(true)
                  await logout()
                  setIsLoading(false)
                }}
                ml={3}
                leftIcon={<MdLogout />}
                disabled={isLoading}
              >
                Cerrar sesión
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
