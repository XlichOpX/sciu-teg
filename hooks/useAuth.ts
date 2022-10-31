import { useRouter } from 'next/router'

export const useAuth = () => {
  const router = useRouter()

  /** Does a fetch to '/api/auth/logout' and then redirects to '/' */
  const logout = async () => {
    await fetch('/api/auth/logout')
    router.push('/auth/login')
  }

  return { logout }
}
