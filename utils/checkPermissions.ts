import { IronSession } from 'iron-session'
import prisma from 'lib/prisma'
// export function canUserDo2({ user }: IronSession, expectedPermission: string) {
//   if (user) {
//     return user.permissions.some(({ permission }) => permission === expectedPermission)
//   } else return false
// }

export async function canUserDo({ user }: IronSession, expectedPermission: string) {
  if (!user) return false
  if (user.role) {
    const roles = user.role.map((rol) => rol.id)
    const permission = await prisma.permission.findMany({
      select: { id: true },
      where: {
        AND: {
          permission: { contains: expectedPermission, mode: 'insensitive' },
          roles: { some: { id: { in: roles } } }
        }
      }
    })
    return permission.length > 0 ? true : false
  } else if (user.permissions) {
    return user.permissions.some(({ permission }) => permission === expectedPermission)
  } else return false
}
