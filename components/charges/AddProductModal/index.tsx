import {
  ButtonProps,
  FormControl,
  FormErrorMessage,
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
  SimpleGrid,
  useDisclosure
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CancelButton, CreateButton } from 'components/app'
import { useProducts } from 'hooks'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { receiptProductSchema } from 'schema/receiptSchema'
import { z } from 'zod'
import { CategorySelect } from './CategorySelect'
import { ProductSelect } from './ProductSelect'

const addProductFormSchema = receiptProductSchema.extend({
  name: z.string(),
  price: z.number()
})

export type AddProductFormData = z.infer<typeof addProductFormSchema>
export type AddProductFormSubmitHandler = SubmitHandler<AddProductFormData>

interface AddProductModalProps extends Omit<ButtonProps, 'onSubmit'> {
  onSubmit: AddProductFormSubmitHandler
}

export const AddProductModal = ({ onSubmit, ...props }: AddProductModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { products } = useProducts({ itemsPerPage: 50 })
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>()

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AddProductFormData>({
    defaultValues: {
      quantity: 1
    },
    resolver: zodResolver(addProductFormSchema)
  })

  const selectedProductId = watch('id')
  const selectedProduct = products?.find((p) => p.id === selectedProductId)
  const selectedProductPrice = selectedProduct?.price ?? 0

  useEffect(() => {
    register('name')
    register('price')
  }, [register])

  useEffect(() => {
    if (!selectedProduct) return
    setValue('name', selectedProduct?.name)
    setValue('price', selectedProduct?.price)
  }, [setValue, selectedProduct])

  let maxProductQuantity = Infinity
  if (selectedProduct && selectedProduct.stock > 0) maxProductQuantity = selectedProduct.stock
  const quantity = watch('quantity')

  return (
    <>
      <CreateButton onClick={onOpen} {...props}>
        Agregar producto
      </CreateButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Agregar producto</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form
              onSubmit={handleSubmit((data) => {
                onSubmit(data)
                onClose()
              })}
              id="AddProductForm"
              noValidate
            >
              <FormControl mb={4} isRequired>
                <FormLabel>Categoría</FormLabel>
                <CategorySelect onChange={setSelectedCategoryId} value={selectedCategoryId} />
              </FormControl>

              <FormControl mb={4} isInvalid={!!errors.id} isRequired>
                <FormLabel>Producto</FormLabel>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <ProductSelect
                      categoryId={selectedCategoryId}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={2} gap={4} alignItems="center">
                <FormControl isInvalid={!!errors.quantity} isRequired>
                  <FormLabel>Cantidad</FormLabel>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        min={1}
                        max={maxProductQuantity}
                        {...field}
                        onChange={(_, v) => field.onChange(v || 0)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.300" zIndex={0}>
                      $
                    </InputLeftElement>
                    <Input readOnly value={selectedProductPrice * quantity} />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />
            <CreateButton type="submit" form="AddProductForm">
              Agregar producto
            </CreateButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
