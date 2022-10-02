import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid
} from '@chakra-ui/react'
import useCategories from 'hooks/useCategories'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ProductInput } from 'types/product'

interface Props {
  id: string
  onSubmit: SubmitHandler<ProductInput>
  formHook: ReturnType<typeof useForm<ProductInput>>
}

const ProductForm = ({ onSubmit, formHook, ...props }: Props) => {
  const { categories } = useCategories()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = formHook

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormControl mb={4} isInvalid={!!errors.name}>
        <FormLabel>Nombre</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.categoryId}>
        <FormLabel>Categoría</FormLabel>
        <Select {...register('categoryId', { valueAsNumber: true })} defaultValue="">
          <option disabled value="">
            Seleccionar
          </option>
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
          <Input type="number" {...register('price', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.stock}>
          <FormLabel>Inventario</FormLabel>
          <Input type="number" {...register('stock', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </form>
  )
}

export default ProductForm
