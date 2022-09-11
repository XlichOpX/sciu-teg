import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  useDisclosure
} from '@chakra-ui/react'
import { ComponentPropsWithoutRef } from 'react'
import { BsPlusLg } from 'react-icons/bs'

function AddProductsModal(props: ComponentPropsWithoutRef<typeof Button>) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={<BsPlusLg />} onClick={onOpen} {...props}>
        Agregar producto
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Agregar producto</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Categoría</FormLabel>
                <Select>
                  <option>Categoría X</option>
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Producto</FormLabel>
                <Select>
                  <option>Producto X</option>
                </Select>
              </FormControl>

              <SimpleGrid columns={2} gap={4} alignItems="center">
                <FormControl>
                  <FormLabel>Cantidad</FormLabel>
                  <NumberInput defaultValue={1} min={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">$</InputLeftElement>
                    <Input readOnly textAlign="right" defaultValue="20" />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">Agregar producto</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddProductsModal
