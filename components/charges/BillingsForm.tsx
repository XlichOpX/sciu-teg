import {
  Alert,
  Button,
  Checkbox,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { BsXLg } from 'react-icons/bs'
import { BillingComparatorArgs } from 'types/billing'

export type BillingsFormData = { billings: number[] }
export type ProductReceivable = { id: number; quantity: number; price: number; name: string }

export const BillingsForm = ({
  products,
  billings,
  formHook,
  onProductRemove
}: {
  products: ProductReceivable[]
  billings: BillingComparatorArgs[]
  formHook: UseFormReturn<BillingsFormData>
  onProductRemove: (productId: number) => void
}) => {
  const { control } = formHook

  if (billings.length === 0 && products.length === 0)
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
          {billings.map((b) => (
            <Tr key={b.id}>
              <Td>{b.productName}</Td>
              <Td textAlign="center">$ {b.amount}</Td>
              <Td textAlign="center">
                <Controller
                  name="billings"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      value={b.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, b.id])
                        } else {
                          field.onChange(field.value.filter((v) => v !== b.id))
                        }
                      }}
                    />
                  )}
                />
              </Td>
            </Tr>
          ))}

          {products.map((p) => (
            <Tr key={p.id}>
              <Td>
                {p.name} (x{p.quantity})
              </Td>
              <Td textAlign="center">$ {p.price * p.quantity}</Td>
              <Td textAlign="center">
                <Button
                  variant="ghost"
                  colorScheme="red"
                  size="xs"
                  onClick={() => onProductRemove(p.id)}
                >
                  <BsXLg />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
