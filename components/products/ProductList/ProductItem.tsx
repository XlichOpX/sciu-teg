import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import { ProductWithCategory } from 'pages/api/product'
import EditProductModal from './EditProductModal'

function ProductItem({ product }: { product: ProductWithCategory }) {
  return (
    <Box as="li" rounded="md" p={4} border="1px" borderColor="gray.100">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="sm">
          {product.name}
        </Heading>

        <EditProductModal product={product} />
      </Flex>

      <Divider borderColor="black" my={2} />

      <Box as="ul" listStylePosition="inside">
        <li>Precio: ${product.price}</li>
        <li>Inventario: {product.stock}</li>
        <li>Categoría: {product.category.name}</li>
      </Box>
    </Box>
  )
}

export default ProductItem
