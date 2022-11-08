import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { Career } from 'types/career'
import { EditCareerModal } from './EditCareerModal'

export const CareerItem = ({ career }: { career: Career }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{career.career}</Text>
      {user?.permissions.includes('EDIT_CAREER') && <EditCareerModal career={career} />}
    </SimpleBox>
  )
}
