import {
  ButtonProps,
  FormControl,
  FormLabel,
  Input,
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
import { CancelButton, CreateButton } from 'components/app'
import { useProducts } from 'hooks'
import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { receiptProductSchema } from 'schema/receiptSchema'
import { z } from 'zod'
import { CategorySelect } from './CategorySelect'

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

  const { handleSubmit, register, control, watch, setValue } = useForm<AddProductFormData>({
    defaultValues: {
      quantity: 1
    }
  })

  const filteredProducts = useMemo(
    () => products?.filter((p) => p.categoryId === selectedCategoryId),
    [products, selectedCategoryId]
  )

  // Colocamos el primer item de categories y filteredProducts como la opción seleccionada
  // en sus respectivos selects cada vez que cambien sus arrays
  useEffect(() => {
    if (filteredProducts && filteredProducts.length > 0) {
      setValue('id', filteredProducts[0].id)
    }
  }, [filteredProducts, setValue])

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
            >
              <FormControl mb={4}>
                <FormLabel>Categoría</FormLabel>
                <CategorySelect onChange={setSelectedCategoryId} value={selectedCategoryId} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Producto</FormLabel>
                <Select {...register('id', { valueAsNumber: true })}>
                  {products?.length === 0 && <option disabled>No hay productos</option>}
                  {filteredProducts?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <SimpleGrid columns={2} gap={4} alignItems="center">
                <FormControl>
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
                </FormControl>

                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <Input readOnly value={selectedProductPrice * quantity} />
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
