import { IronSessionOptions } from 'iron-session'
import { Role, User, UserStatus } from '@prisma/client'

// define an user type from cookies without password and secret relation.
export type CookieUser = Omit<User, 'password' | 'secretId' | 'personId' | 'statusId'> & { roles: Role[]; status: UserStatus }

// define ironSession options with password and secure mode when it's necesary
export const ironOptions: IronSessionOptions = {
  cookieName: 'iSession',
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}

// Declare data into ironSession Cookie
declare module 'iron-session' {
  interface IronSessionData {
    user?: CookieUser
  }
}
