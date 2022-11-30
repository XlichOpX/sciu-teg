import { Alert, Button, Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
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
  onProductRemove,
  onChargeClick,
  selectedBillings,
  onBillingItemClick
}: {
  products: ProductReceivable[]
  billings?: BillingComparatorArgs[]
  control?: Control<ReceivablesFormData>
  onProductRemove: (productId: number) => void
  onChargeClick?: () => void
  selectedBillings?: number[]
  onBillingItemClick?: (billingId: number) => void
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
            <Th textAlign="center">
              <Button
                variant="ghost"
                size="xs"
                fontFamily="heading"
                textTransform="uppercase"
                fontWeight="700"
                fontSize="xs"
                letterSpacing="wider"
                onClick={onChargeClick}
              >
                Cobrar
              </Button>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {control &&
            selectedBillings &&
            onBillingItemClick &&
            billings?.map((b) => (
              <BillingItem
                checked={selectedBillings.includes(b.id)}
                onClick={() => onBillingItemClick(b.id)}
                key={b.id}
                billing={b}
              />
            ))}

          {products.map((p) => (
            <ProductItem key={p.id} product={p} onProductRemove={onProductRemove} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
