import useSWR from 'swr'

export const useBillings = (docNumber: string) => {
  const { data, error } = useSWR<any, Error>(docNumber ? `/api/student/${docNumber}/billing` : null)
  return { data, error, isLoading: !data && !error }
}
