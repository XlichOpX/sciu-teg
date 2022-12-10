import { Button, Td, Tr } from '@chakra-ui/react'
import { ConvertableAmount } from 'components/app'
import { BsXLg } from 'react-icons/bs'
import { ProductReceivable } from '.'

export const ProductItem = ({
  product,
  onProductRemove
}: {
  product: ProductReceivable
  onProductRemove: (productId: number) => void
}) => (
  <Tr key={product.id}>
    <Td>
      {product.name} (x{product.quantity})
    </Td>
    <Td textAlign="center">
      <ConvertableAmount amount={product.price * product.quantity} />
    </Td>
    <Td textAlign="center">
      <Button
        variant="ghost"
        colorScheme="red"
        size="xs"
        onClick={() => onProductRemove(product.id)}
      >
        <BsXLg />
      </Button>
    </Td>
  </Tr>
)
