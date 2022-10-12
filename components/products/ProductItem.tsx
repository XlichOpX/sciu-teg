import { Divider, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { SubmitHandler } from 'react-hook-form'
import { BsBoxSeam, BsCurrencyDollar } from 'react-icons/bs'
import { MdOutlineCategory } from 'react-icons/md'
import { ProductInput, ProductWithCategory } from 'types/product'
import { EditProductModal } from './EditProductModal'

export const ProductItem = ({
  product: { categoryId, category, name, price, stock },
  onUpdate,
  onDelete
}: {
  product: ProductWithCategory
  onUpdate: SubmitHandler<ProductInput>
  onDelete: () => void
}) => (
  <SimpleBox>
    <Flex alignItems="center" justifyContent="space-between">
      <Heading as="h2" size="sm" noOfLines={2}>
        {name}
      </Heading>

      <EditProductModal
        defaultValues={{ categoryId, name, price, stock }}
        onSubmit={onUpdate}
        onDelete={onDelete}
      />
    </Flex>

    <Divider my={2} />

    <VStack align="flex-start">
      <HStack as="p">
        <BsCurrencyDollar /> <span>Precio: {price}</span>
      </HStack>
      <HStack as="p">
        <BsBoxSeam /> <span>Inventario: {stock >= 0 ? stock : 'No aplica'}</span>
      </HStack>
      <HStack as="p">
        <MdOutlineCategory /> <span>Categoría: {category.name}</span>
      </HStack>
    </VStack>
  </SimpleBox>
)
