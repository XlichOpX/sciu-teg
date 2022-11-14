import { HttpError } from 'lib/http-error'
import useSWR from 'swr'
import { BillingComparatorArgs } from 'types/billing'
import { StudentWithPersonCareerAndStatus } from 'types/student'

export const useBillings = (docNumber: string) => {
  const { data, error, mutate } = useSWR<
    { student: StudentWithPersonCareerAndStatus; billings: BillingComparatorArgs[] },
    HttpError
  >(docNumber ? `/api/student/${docNumber}/billing` : null)
  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
    errorMsg: error
      ? error.statusCode === 404
        ? 'Estudiante no encontrado'
        : 'Ocurrió un error al buscar el estudiante'
      : undefined
  }
}
