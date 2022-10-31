import { Alert, Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { Control } from 'react-hook-form'
import { BillingComparatorArgs } from 'types/billing'
import { BillingItem } from './BillingItem'
import { ProductItem } from './ProductReceivableItem'

export type ReceivablesFormData = { billings: number[] }
export type ProductReceivable = { id: number; quantity: number; price: number; name: string }

export const ReceivablesForm = ({
  products,
  billings,
  control,
  onProductRemove
}: {
  products: ProductReceivable[]
  billings?: BillingComparatorArgs[]
  control?: Control<ReceivablesFormData>
  onProductRemove: (productId: number) => void
}) => {
  if (billings?.length === 0 && products.length === 0)
    return <Alert>El estudiante no posee deudas por pagar.</Alert>

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Concepto</Th>
            <Th textAlign="center">Monto</Th>
            <Th textAlign="center">Cobrar</Th>
          </Tr>
        </Thead>

        <Tbody>
          {control &&
            billings?.map((b) => <BillingItem key={b.id} billing={b} control={control} />)}

          {products.map((p) => (
            <ProductItem key={p.id} product={p} onProductRemove={onProductRemove} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
