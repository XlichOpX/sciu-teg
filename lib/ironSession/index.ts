import { Permission, Role, User, UserStatus } from '@prisma/client'
import { IronSessionOptions } from 'iron-session'

// define an user type from cookies without password and secret relation.
export type CookieUser = Pick<User, 'id' | 'username'> & {
  role?: Pick<Role, 'id'>[]
  permissions?: Pick<Permission, 'permission'>[]
  status: UserStatus
}

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
