import {
  Button,
  chakra,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VisuallyHidden
} from '@chakra-ui/react'
import Image from 'next/image'
import formatExampleImg from 'public/img/formato-excel-cobros.png'
import { BsCheckLg, BsQuestionCircle } from 'react-icons/bs'

export const ExampleSheetModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} variant="ghost">
        <VisuallyHidden>Especificaciones del documento</VisuallyHidden>
        <BsQuestionCircle size={24} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Especificaciones del documento para importar cobros</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={formatExampleImg}
              alt="Formato que debe tener la hoja de excel a importar. Columnas:, cedula, semestre, mensualidad, producto, precio, cantidad, metodo_de_pago, moneda, monto_cobrado, referencia, fecha"
            />

            <Divider my={3} />

            <Stack>
              <Text>
                Todos los cobros a importar deben estar obligatoriamente en la primera y única hoja
                del documento de Excel. La hoja debe consistir de las siguientes columnas con sus
                respectivos datos:
              </Text>

              <chakra.ul listStylePos="inside" pl={4}>
                <li>cedula</li>
                <li>semestre (opcional si se trata del cobro de un producto)</li>
                <li>mensualidad (opcional si se trata del cobro de un producto)</li>
                <li>producto</li>
                <li>precio</li>
                <li>cantidad</li>
                <li>metodo_de_pago</li>
                <li>moneda</li>
                <li>monto_cobrado</li>
                <li>referencia</li>
                <li>fecha</li>
              </chakra.ul>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose} leftIcon={<BsCheckLg />}>
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
