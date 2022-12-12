import { HttpError } from 'lib/http-error'
import { useRouter } from 'next/router'
import { createContext, useCallback, type ReactNode } from 'react'
import { getUser } from 'services/auth'
import useSWR from 'swr'

type AuthContext = {
  logout: () => Promise<void>
  user: Awaited<ReturnType<typeof getUser>> | null
  error: HttpError
  mutate: () => void
}

export const AuthContext = createContext<AuthContext | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, error, mutate } = useSWR(userFetchKey, getUser)
  const router = useRouter()

  /** Does a fetch to '/api/auth/logout' and then redirects to '/auth/login' */
  const logout = useCallback(async () => {
    await fetch('/api/auth/logout')
    router.push('/auth/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user: data ?? null, logout, error, mutate }}>
      {children}
    </AuthContext.Provider>
  )
}

export const userFetchKey = '/api/auth/user'
