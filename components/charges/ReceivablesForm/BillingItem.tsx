import { Checkbox, Td, Tr } from '@chakra-ui/react'
import { ConvertableAmount } from 'components/app'
import { BillingComparatorArgs } from 'types/billing'

export const BillingItem = ({
  onClick,
  billing,
  checked
}: {
  billing: BillingComparatorArgs
  checked: boolean
  onClick: () => void
}) => (
  <Tr key={billing.id} onClick={onClick} _light={{ _hover: { bgColor: 'gray.50' } }}>
    <Td>{billing.productName}</Td>
    <Td textAlign="center">
      <ConvertableAmount amount={billing.amount} />
    </Td>
    <Td textAlign="center">
      <Checkbox isChecked={checked} pointerEvents="none" />
    </Td>
  </Tr>
)
