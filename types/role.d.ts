import { Prisma } from '@prisma/client'
import { roleWithPermissions } from 'prisma/queries'

export type RoleWithPermissions = Prisma.RoleGetPayload<typeof roleWithPermissions>
