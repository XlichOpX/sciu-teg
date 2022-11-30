import { Text } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import { useSemesters } from 'hooks'
import { toLocaleDateString } from 'utils/toLocaleDateString'

export const SemesterIndicator = () => {
  const { semesters, isLoading } = useSemesters()
  const currentSemester = semesters?.[0]

  if (isLoading) return <FullyCenteredSpinner />

  return (
    <div>
      {currentSemester && (
        <>
          <Text textAlign="center">Semestre {currentSemester?.semester}</Text>
          <Text textAlign="center">
            {toLocaleDateString(currentSemester?.startDate)} -{' '}
            {toLocaleDateString(currentSemester?.endDate)}
          </Text>
        </>
      )}
    </div>
  )
}
