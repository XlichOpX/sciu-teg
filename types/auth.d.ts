import type { Permission, Role, UserStatus } from '@prisma/client'

export type GetUserResponse = {
  permissions: Permission[]
  id: number
  username: string
  role?: Pick<Role, 'id'>[]
  status: UserStatus
}
