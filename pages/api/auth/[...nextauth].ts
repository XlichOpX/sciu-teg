import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authorize } from '../../../services/CredentialsProvider'

const { GITHUB_ID, GITHUB_SECRET } = process.env

if (!GITHUB_ID || !GITHUB_SECRET) throw new Error('Not Github eviroment variables configured')

export const authOptions: NextAuthOptions = {
  // configure all providers here
  providers: [
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      // @ts-ignore
      scope: 'read:user'
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'kurokuro15' },
        password: { label: 'Password', type: 'password' }
      },
      authorize
    })
  ],
  callbacks: {
    async session({ session, token }) {
        session.user  = token.user as { id:number, statusId:number, username:string }

      return session 
    }, 
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    }
  }
}

export default NextAuth(authOptions)