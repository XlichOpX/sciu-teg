import { Prisma } from '@prisma/client'
import { fetch } from 'lib/fetch'
import { userSchema } from 'schema/userSchema'
import { z } from 'zod'

const parseFormData = ({
  username,
  password,
  secret,
  person,
  statusId,
  roles
}: z.infer<typeof userSchema>) => {
  let personData

  if (typeof person === 'number') {
    personData = {
      connect: {
        id: person
      }
    }
  } else {
    const { docTypeId, ...rest } = person
    personData = {
      create: {
        ...rest,
        address: {
          create: {
            shortAddress: person.address
          }
        },
        docType: {
          connect: { id: docTypeId }
        }
      }
    }
  }

  return Prisma.validator<Prisma.UserCreateInput>()({
    username,
    password,
    secret: {
      create: {
        ...secret
      }
    },
    person: personData,
    status: {
      connect: {
        id: statusId
      }
    },
    roles: {
      connect: roles.map((r) => ({ id: r.value }))
    }
  })
}

export const createUser = async (data: z.infer<typeof userSchema>) => {
  return await fetch('/api/user', { method: 'POST', body: parseFormData(data) })
}
