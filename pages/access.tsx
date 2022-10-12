import LoginBtn from '../components/app/LoginBtn'

import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'

import { Permission } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
export default function SsrProfile({ user }: InferGetServerSidePropsType<GetServerSideProps>) {
  return (
    <>
      <h2>{user.username} </h2>
      Permisos:
      {user.permissions.map((p: Permission) => (
        <>
          <p>{p.permission}</p> <br />
        </>
      ))}
      <LoginBtn />
    </>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const user = req.session.user

  if (user === undefined) {
    res.setHeader('location', '/login')
    res.statusCode = 302
    res.end()
    return {
      props: {
        user
      }
    }
  }

  return {
    props: { user: req.session.user }
  }
}, ironOptions)
