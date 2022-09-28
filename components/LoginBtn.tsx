import { useRouter } from "next/router"

export default function LoginBtn() {
  const router = useRouter()
  const signOut = async () => {
    const res = await fetch('/api/auth/logout')
    if(res.ok)
      router.push('/')
  }
   return (
      <>
        ¡You have access !<br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
}