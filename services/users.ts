import { Prisma } from '@prisma/client'
import { UserFormData } from 'components/settings/users'
import { fetch } from 'lib/fetch'

const parseFormData = ({
  username,
  password,
  secret,
  person: { address, docTypeId, ...person },
  statusId,
  roles
}: UserFormData) =>
  Prisma.validator<Prisma.UserCreateInput>()({
    username,
    password,
    secret: {
      create: {
        ...secret
      }
    },
    person: {
      create: {
        ...person,
        address: {
          create: {
            shortAddress: address
          }
        },
        docType: {
          connect: { id: docTypeId }
        }
      }
    },
    status: {
      connect: {
        id: statusId
      }
    },
    roles: {
      connect: roles.map((r) => ({ id: r.value }))
    }
  })

export const createUser = async (data: UserFormData) => {
  return await fetch('/api/user', { method: 'POST', body: parseFormData(data) })
}
