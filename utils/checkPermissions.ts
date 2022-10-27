import { IronSession } from 'iron-session'

export function canUserDo({ user }: IronSession, expectedPermission: string) {
  if (user) {
    return user.permissions.some(({ permission }) => permission === expectedPermission)
  } else return false
}

export function checkAllPermissions({ user }: IronSession, expectedPermission: Array<string>) {
  if (user) {
    return user.permissions.map(({ permission }) => ({
      [permission]: expectedPermission.includes(permission)
    }))
  } else return []
}
