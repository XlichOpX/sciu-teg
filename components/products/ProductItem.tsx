import { Divider, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { EditButton, SimpleBox } from 'components'
import { SubmitHandler } from 'react-hook-form'
import { BsBoxSeam, BsCurrencyDollar } from 'react-icons/bs'
import { MdOutlineCategory } from 'react-icons/md'
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
    <SimpleBox>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="sm">
          {name}
        </Heading>

        <ProductFormModal
          trigger={<EditButton alignSelf="flex-start" />}
          title="Editar producto"
          defaultValues={{ categoryId: category.id, name, price, stock }}
          onSubmit={onUpdate}
          confirmText="Guardar"
        />
      </Flex>

      <Divider my={2} />

      <VStack align="flex-start">
        <HStack as="p">
          <BsCurrencyDollar /> <span>Precio: {price}</span>
        </HStack>
        <HStack as="p">
          <BsBoxSeam /> <span>Inventario: {stock}</span>
        </HStack>
        <HStack as="p">
          <MdOutlineCategory /> <span>Categoría: {category.name}</span>
        </HStack>
      </VStack>
    </SimpleBox>
  )
}

export default ProductItem
