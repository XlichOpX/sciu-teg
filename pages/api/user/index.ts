import { Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { encryptToSaveDB, secretCrypt } from 'lib/crypter'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userEssentials } from 'prisma/queries'
import { userSchema } from 'schema/userSchema'
import validateBody from 'utils/bodyValidate'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/user
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  // es una idea temporal...
  if (!(await canUserDo(session, 'ACCESS_USERS_MUTATION')))
    return res.status(403).send(`Can't access this.`)

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_USER'))) return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los usuarios
      try {
        const users = await prisma.user.findMany({
          ...userEssentials,
          orderBy: { username: 'asc' }
        })

        if (!users) return res.status(404).end(`Users not found`)
        res.status(200).send(users)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_USER')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN usuario
      try {
        // Validamos los campos del request body
        const validBody = await validateBody(body, userSchema)
        const { data } = validBody
        //extraemos la 'data' validada

        //preparamos los objetos de creación : person, secret y user.

        //antes, validamos que el usuario esté disponible.
        const existUser = await prisma.user.findFirst({
          where: { username: { equals: data.username } }
        })
        if (existUser) throw Error(`username ${data.username} was taken`)

        // Sí el tipo de data.person es number, entonces conectamos, si es un objeto, mapeamos y preparamos para crearlo
        let person:
          | Prisma.PersonCreateNestedOneWithoutStudentInput
          | Prisma.PersonCreateNestedOneWithoutUserInput
        if (typeof data.person === 'number') {
          person = { connect: { id: data.person } }
        } else {
          const { person: ps } = data
          person = {
            create: {
              firstName: ps.firstName,
              middleName: ps.middleName,
              firstLastName: ps.firstLastName,
              secondLastName: ps.secondLastName,
              docNumber: ps.docNumber,
              email: ps.email,
              landline: ps.landline,
              address: { connect: { id: ps.address } },
              docType: { connect: { id: ps.docTypeId } },
              cellphone: ps.cellphone
            }
          }
        }
        //preparamos el secret encriptando las respuestas...
        const secret: Prisma.SecretCreateNestedOneWithoutUserInput = {
          create: secretCrypt(data.secret)
        }

        //preparamos la contraseña
        const password = encryptToSaveDB(data.password)

        const roles: Prisma.RoleCreateNestedManyWithoutUsersInput = {
          connect: data.roles.map((rol) => ({ id: rol.value }))
        }
        // Creamos al usuario
        const userStatus: Prisma.UserStatusWhereUniqueInput =
          await prisma.userStatus.findFirstOrThrow({
            select: { id: true },
            where: { OR: [{ id: data.statusId }, { status: stringSearch('activo') }] }
          })

        const result = await prisma.user.create({
          data: {
            password,
            person,
            roles,
            secret,
            status: { connect: userStatus },
            username: data.username
          }
        })
        res.status(201).send(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
