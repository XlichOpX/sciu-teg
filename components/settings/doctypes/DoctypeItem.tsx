import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { DocType } from 'types/doctype'
import { EditDoctypeModal } from './EditDoctypeModal'

export const DoctypeItem = ({ doctype }: { doctype: DocType }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{doctype.type}</Text>
      {user?.permissions.includes('EDIT_DOCTYPE') && <EditDoctypeModal doctype={doctype} />}
    </SimpleBox>
  )
}
