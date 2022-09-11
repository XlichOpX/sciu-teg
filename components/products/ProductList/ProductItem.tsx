import { Flex, Heading, Button, Divider, Box, VisuallyHidden } from '@chakra-ui/react'
import { BsPencilFill } from 'react-icons/bs'

function ProductItem() {
  return (
    <Box as="li" rounded="md" p={4} border="1px" borderColor="gray.100">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="sm">
          Producto X
        </Heading>

        <Button variant="ghost" size="xs">
          <VisuallyHidden>Editar</VisuallyHidden>
          <BsPencilFill />
        </Button>
      </Flex>

      <Divider borderColor="black" my={2} />

      <Box as="ul" listStylePosition="inside">
        <li>Precio: $20</li>
        <li>Inventario: $20</li>
        <li>Categoría: Cualquiera</li>
      </Box>
    </Box>
  )
}

export default ProductItem
