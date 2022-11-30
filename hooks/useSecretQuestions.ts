import { SecretQuestion } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'

export const useSecretQuestions = () => {
  const [search, setSearch] = useState('')
  const { data, error } = useSWR<SecretQuestion[], Error>('/api/secretQuestion')

  return {
    secretQuestions: data,
    error,
    isLoading: !data && !error,
    search,
    setSearch
  }
}

export const SecretQuestionKeysMatcher = '^/api/secretQuestion.*'
