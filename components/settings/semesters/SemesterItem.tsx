import { chakra, Divider, Flex, Text } from '@chakra-ui/react'
import { Semester } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import dayjs from 'lib/dayjs'
import { EditSemesterModal } from './EditSemesterModal'

export const SemesterItem = ({
  semester,
  isCurrent = false
}: {
  semester: Semester
  isCurrent?: boolean
}) => {
  const { user } = useAuth()

  return (
    <SimpleBox
      as="li"
      justifyContent="space-between"
      borderColor={isCurrent ? 'blue.300' : undefined}
    >
      <Flex justify="space-between">
        <Text fontWeight="bold">
          {semester.semester}{' '}
          {isCurrent && (
            <chakra.span fontWeight="normal" fontStyle="italic">
              (semestre actual)
            </chakra.span>
          )}
        </Text>
        {user?.permissions.includes('EDIT_SEMESTER') && <EditSemesterModal semester={semester} />}
      </Flex>

      <Divider my={2} />

      <Text>Inicio: {dayjs(semester.startDate).format('dddd, D [de] MMMM [de] YYYY')}</Text>
      <Text>Fin: {dayjs(semester.endDate).format('dddd, D [de] MMMM [de] YYYY')}</Text>
    </SimpleBox>
  )
}
