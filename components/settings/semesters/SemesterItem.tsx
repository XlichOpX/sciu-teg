import { Divider, Flex, Text } from '@chakra-ui/react'
import { Semester } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { toDateInputString } from 'utils/toDateInputString'
import { EditSemesterModal } from './EditSemesterModal'

export const SemesterItem = ({ semester }: { semester: Semester }) => {
  const { user } = useAuth()

  return (
    <SimpleBox as="li" justifyContent="space-between">
      <Flex justify="space-between">
        <Text fontWeight="bold">{semester.semester}</Text>
        {user?.permissions.includes('EDIT_SEMESTER') && <EditSemesterModal semester={semester} />}
      </Flex>

      <Divider my={2} />

      <Text>Inicio: {toDateInputString(semester.startDate)}</Text>
      <Text>Fin: {toDateInputString(semester.endDate)}</Text>
    </SimpleBox>
  )
}
