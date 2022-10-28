import useSWR from 'swr'
import { BillingComparatorArgs } from 'types/billing'
import { StudentWithPersonCareerAndStatus } from 'types/student'

export const useBillings = (docNumber: string) => {
  const { data, error, mutate } = useSWR<
    { student: StudentWithPersonCareerAndStatus; billings: BillingComparatorArgs[] },
    Error
  >(docNumber ? `/api/student/${docNumber}/billing` : null)
  return { data, error, isLoading: !data && !error, mutate }
}
