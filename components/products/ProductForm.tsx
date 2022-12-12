import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import { useCategories } from 'hooks'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ProductInput } from 'types/product'
import { INSCRIPTION, LATE_PAYMENT, MONTHLY_PAYMENT } from 'utils/constants'

export type ProductFormSubmitHandler = SubmitHandler<ProductInput>

interface Props {
  id: string
  onSubmit: ProductFormSubmitHandler
  formHook: ReturnType<typeof useForm<ProductInput>>
  defaultValues?: Partial<ProductInput>
}

const defaultStockValue = 15
const lockedProducts = [MONTHLY_PAYMENT, INSCRIPTION, LATE_PAYMENT]

export const ProductForm = ({ onSubmit, formHook, defaultValues, ...props }: Props) => {
  const { categories, isLoading, errorMsg } = useCategories()

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    resetField,
    formState: { errors }
  } = formHook

  const [hasStock, setHasStock] = useState((getValues('stock') ?? -1) >= 0)

  if (isLoading) return <FullyCenteredSpinner />

  return (
    <VStack gap={3} as="form" onSubmit={handleSubmit(onSubmit)} {...props} noValidate>
      <FormControl isInvalid={!!errors.name} isRequired>
        <FormLabel>Nombre</FormLabel>
        <Input
          {...register('name')}
          isReadOnly={defaultValues?.name ? lockedProducts.includes(defaultValues.name) : false}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.categoryId} isRequired>
        <FormLabel>Categoría</FormLabel>
        <Select {...register('categoryId', { valueAsNumber: true })}>
          {errorMsg && <option disabled>{errorMsg}</option>}
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.categoryId?.message}</FormErrorMessage>
      </FormControl>

      <SimpleGrid columns={2} gap={4}>
        <FormControl isInvalid={!!errors.price} isRequired>
          <FormLabel>Precio</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              _dark={{ color: 'gray.300' }}
              _light={{ color: 'gray.700' }}
            >
              $
            </InputLeftElement>
            <Input type="number" {...register('price', { valueAsNumber: true })} />
          </InputGroup>
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.stock} hidden={!hasStock} isRequired>
          <FormLabel>Inventario</FormLabel>
          <Input type="number" {...register('stock', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <FormControl my={4} isRequired>
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
    </VStack>
  )
}
