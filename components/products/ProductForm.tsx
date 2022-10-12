import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import useCategories from 'hooks/useCategories'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ProductInput } from 'types/product'

interface Props {
  id: string
  onSubmit: SubmitHandler<ProductInput>
  formHook: ReturnType<typeof useForm<ProductInput>>
  defaultValues?: Partial<ProductInput>
}

const defaultStockValue = 15

export const ProductForm = ({ onSubmit, formHook, defaultValues, ...props }: Props) => {
  const { categories } = useCategories()

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    resetField,
    formState: { errors }
  } = formHook

  const [hasStock, setHasStock] = useState((getValues('stock') ?? -1) >= 0)

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Nombre</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.categoryId}>
        <FormLabel>Categoría</FormLabel>
        <Select {...register('categoryId', { valueAsNumber: true })}>
          {categories &&
            categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </Select>
        <FormErrorMessage>{errors.categoryId?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={4}>
        <Checkbox
          defaultChecked={hasStock}
          checked={hasStock}
          onChange={(e) => {
            setHasStock(e.target.checked)
            const itHadStock = (defaultValues?.stock ?? -1) >= 0
            if (e.target.checked)
              return itHadStock ? resetField('stock') : setValue('stock', defaultStockValue)

            setValue('stock', -1)
          }}
        >
          ¿Maneja inventario?
        </Checkbox>
      </FormControl>

      <SimpleGrid columns={2} gap={4}>
        <FormControl isInvalid={!!errors.price}>
          <FormLabel>Precio</FormLabel>
          <Input type="number" {...register('price', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.stock} hidden={!hasStock}>
          <FormLabel>Inventario</FormLabel>
          <Input type="number" {...register('stock', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </VStack>
  )
}
