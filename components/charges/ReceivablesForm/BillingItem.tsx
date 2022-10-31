import { Checkbox, Td, Tr } from '@chakra-ui/react'
import { Control, Controller } from 'react-hook-form'
import { BillingComparatorArgs } from 'types/billing'
import { BillingsFormData } from '.'

export const BillingItem = ({
  billing,
  control
}: {
  billing: BillingComparatorArgs
  control: Control<BillingsFormData>
}) => (
  <Tr key={billing.id}>
    <Td>{billing.productName}</Td>
    <Td textAlign="center">$ {billing.amount}</Td>
    <Td textAlign="center">
      <Controller
        name="billings"
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            value={billing.id}
            onChange={(e) => {
              if (e.target.checked) {
                field.onChange([...field.value, billing.id])
              } else {
                field.onChange(field.value.filter((v) => v !== billing.id))
              }
            }}
          />
        )}
      />
    </Td>
  </Tr>
)
