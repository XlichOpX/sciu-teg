import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  useDisclosure
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import EditButton from 'components/EditButton'
import useCategories from 'hooks/useCategories'
import { SubmitHandler, useForm } from 'react-hook-form'
import { productSchema } from 'schema/productSchema'
import { updateProduct } from 'services/products'
import { useSWRConfig } from 'swr'
import type { ProductInput, ProductWithCategory } from '../../../types/product'

function EditProductModal({ product }: { product: ProductWithCategory }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { categories } = useCategories()
  const { mutate } = useSWRConfig()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductInput>({ resolver: zodResolver(productSchema) })

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    await updateProduct(product.id, data)
    mutate('/api/product')
    onClose()
  }

  return (
    <>
      <EditButton onClick={onOpen} alignSelf="flex-start" />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>Editar producto</h3>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} id="editProductForm">
              <FormControl mb={4} isInvalid={!!errors.name}>
                <FormLabel>Nombre</FormLabel>
                <Input defaultValue={product.name} {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!errors.categoryId}>
                <FormLabel>Categoría</FormLabel>
                <Select
                  defaultValue={product.category.id}
                  {...register('categoryId', { valueAsNumber: true })}
                >
                  {categories &&
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </Select>
                <FormErrorMessage>{errors.categoryId?.message}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={2} gap={4}>
                <FormControl isInvalid={!!errors.price}>
                  <FormLabel>Precio</FormLabel>
                  <Input
                    type="number"
                    defaultValue={product.price}
                    {...register('price', { valueAsNumber: true })}
                  />
                  <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.stock}>
                  <FormLabel>Inventario</FormLabel>
                  <Input
                    type="number"
                    defaultValue={product.stock}
                    {...register('stock', { valueAsNumber: true })}
                  />
                  <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit" form="editProductForm" disabled={isSubmitting}>
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProductModal
