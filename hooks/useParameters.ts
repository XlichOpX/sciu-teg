import { Parameters } from '@prisma/client'
import useSWR from 'swr'
import { updateParameters as updateParametersSv } from 'services/parameters'
import { useToast } from '@chakra-ui/react'

function useParameters() {
  const { data, error, mutate } = useSWR<Parameters[], Error>('/api/parameters')
  const toast = useToast()

  const updateParameters = async (id: number, data: Parameters) => {
    try {
      await updateParametersSv(id, data)
      await mutate()
      toast({ status: 'success', description: 'Parámetros guardados' })
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al guardar los parámetros' })
    }
  }

  return { parameters: data && data[0], error, updateParameters }
}

export default useParameters
