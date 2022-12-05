import { HttpError } from 'lib/http-error'
import useSWR from 'swr'
import { BillingComparatorArgs } from 'types/billing'
import { StudentWithPersonCareerAndStatus } from 'types/student'

export const useBillings = (studentId: string) => {
  const { data, error, mutate } = useSWR<
    { student: StudentWithPersonCareerAndStatus; billings: BillingComparatorArgs[] },
    HttpError
  >(studentId ? `/api/student/${studentId}/billing` : null)

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
    errorMsg: error
      ? error.statusCode === 404
        ? 'Estudiante no encontrado'
        : error.statusCode === 403
        ? 'No tiene permiso para ver las deudas de los estudiantes'
        : 'Ocurrió un error al buscar el estudiante'
      : undefined
  }
}
