import { Text } from '@chakra-ui/react'
import { SimpleBox } from 'components/app'
import { Career } from 'types/career'
import { EditCareerModal } from './EditCareerModal'

export const CareerItem = ({ career }: { career: Career }) => (
  <SimpleBox as="li" display="flex" justifyContent="space-between">
    <Text fontWeight="bold">{career.career}</Text>
    <EditCareerModal career={career} />
  </SimpleBox>
)
