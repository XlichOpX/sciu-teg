import { Checkbox, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { BillingComparatorArgs } from 'types/billing'

export type BillignsFormData = { billings: number[] }

export const BillingsForm = ({
  billings,
  formHook
}: {
  billings: BillingComparatorArgs[]
  formHook: UseFormReturn<BillignsFormData>
}) => {
  const { control } = formHook

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
              <Td textAlign="center">{b.amount}</Td>
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
        </Tbody>
      </Table>
    </TableContainer>
  )
}
