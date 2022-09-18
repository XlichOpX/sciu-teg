import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import EditProductModal from './EditProductModal'

function ProductItem() {
  return (
    <Box as="li" rounded="md" p={4} border="1px" borderColor="gray.100">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="sm">
          Producto X
        </Heading>

        <EditProductModal />
      </Flex>

      <Divider borderColor="black" my={2} />

      <Box as="ul" listStylePosition="inside">
        <li>Precio: $20</li>
        <li>Inventario: 20</li>
        <li>Categoría: Cualquiera</li>
      </Box>
    </Box>
  )
}

export default ProductItem
