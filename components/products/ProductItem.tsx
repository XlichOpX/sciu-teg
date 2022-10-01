import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import { EditButton } from 'components'
import { SubmitHandler } from 'react-hook-form'
import { ProductInput, ProductWithCategory } from 'types/product'
import ProductFormModal from './ProductFormModal'

function ProductItem({
  product: { category, name, price, stock },
  onUpdate
}: {
  product: ProductWithCategory
  onUpdate: SubmitHandler<ProductInput>
}) {
  return (
    <Box as="li" rounded="md" p={4} border="1px" borderColor="gray.100">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="sm">
          {name}
        </Heading>

        <ProductFormModal
          trigger={<EditButton alignSelf="flex-start" />}
          title="Editar producto"
          defaultValues={{ categoryId: category.id, name, price, stock }}
          onSubmit={onUpdate}
          confirmText="Guardar cambios"
        />
      </Flex>

      <Divider borderColor="black" my={2} />

      <Box as="ul" listStylePosition="inside">
        <li>Precio: {price}</li>
        <li>Inventario: {stock}</li>
        <li>Categoría: {category.name}</li>
      </Box>
    </Box>
  )
}

export default ProductItem
