import { Text } from '@chakra-ui/react'
import { Semester } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { EditSemesterModal } from './EditSemesterModal'

export const SemesterItem = ({ semester }: { semester: Semester }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" display="flex" justifyContent="space-between">
      <Text fontWeight="bold">{semester.semester}</Text>
      {user?.permissions.includes('EDIT_SEMESTER') && <EditSemesterModal semester={semester} />}
    </SimpleBox>
  )
}
