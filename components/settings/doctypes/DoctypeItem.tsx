import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { DocType } from 'types/doctype'
import { EditDoctypeModal } from './EditDoctypeModal'

export const DoctypeItem = ({ doctype }: { doctype: DocType }) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">{doctype.type}</Text>
    <EditDoctypeModal doctype={doctype} />
  </SimpleBox>
)
