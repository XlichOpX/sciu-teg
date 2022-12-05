import { fetch } from 'lib/fetch'
import { StudentWithPersonCareerAndStatus } from 'types/student'
import { APIListing } from 'types/utils'

export const getStudents = async ({ keyword }: { keyword: string }) => {
  return (await fetch(
    `/api/student?keyword=${keyword}`
  )) as APIListing<StudentWithPersonCareerAndStatus>
}
