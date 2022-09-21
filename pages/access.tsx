import { useSession, signIn, signOut } from 'next-auth/react'
import LoginBtn from '../components/LoginBtn'
export default function Component() {
  const { data } = useSession()
  return (
    <>
      <LoginBtn />
      <>Access Token: {data?.accessToken}</>
    </>
  )
}
