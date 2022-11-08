import { Divider, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { BsBoxSeam, BsCurrencyDollar } from 'react-icons/bs'
import { MdOutlineCategory } from 'react-icons/md'
import { ProductWithCategory } from 'types/product'
import { EditProductModal } from './EditProductModal'

export const ProductItem = ({ product }: { product: ProductWithCategory }) => {
  const { user } = useAuth()

  return (
    <SimpleBox>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="sm" noOfLines={2}>
          {product.name}
        </Heading>

        {user?.permissions.includes('EDIT_PRODUCT') && <EditProductModal product={product} />}
      </Flex>

      <Divider my={2} />

      <VStack align="flex-start">
        <HStack as="p">
          <BsCurrencyDollar /> <span>Precio: {product.price}</span>
        </HStack>
        <HStack as="p">
          <BsBoxSeam /> <span>Inventario: {product.stock >= 0 ? product.stock : 'No aplica'}</span>
        </HStack>
        <HStack as="p">
          <MdOutlineCategory /> <span>Categoría: {product.category.name}</span>
        </HStack>
      </VStack>
    </SimpleBox>
  )
}
