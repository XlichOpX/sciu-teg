import { withIronSessionApiRoute } from 'iron-session/next'
import { encryptToSaveDB, secretCrypt } from 'lib/crypter'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userEssentials, userWithAll } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(userHandler, ironOptions)

async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'ACCESS_USERS_MUTATION')))
    return res.status(403).send(`Can't access this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_USER'))) return res.status(403).send(`Can't read this.`)
      //obtenemos a UN usuario
      try {
        const user = await prisma.user.findFirst({
          ...userWithAll,
          where: { id: Number(id) }
        })
        if (!user) res.status(404).end(`User not found`)
        res.status(200).send(user)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_USER'))) return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN usuario
      try {
        const user = await prisma.user.findFirst({
          where: { id: Number(id) }
        })
        if (!user) res.status(404).end(`User not found`)

        const { password, secret, passwordConfirm } = body

        // Hasheamos la contraseña
        if (passwordConfirm || password)
          if (!(password === passwordConfirm)) return res.status(404).end(`Password not match`)

        const cryptoPass = encryptToSaveDB(password)
        body.password = cryptoPass
        if (passwordConfirm) body.passwordConfirm = undefined
        // Hasheamos las respuestas
        if (secret) {
          secret.create = secretCrypt(secret.create)
        }

        const updateUser = await prisma.user.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          },
          ...userEssentials
        })
        res.status(201).send(updateUser)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_USER')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN usuario
      try {
        const delUser = await prisma.user.delete({ where: { id: Number(id) } })
        res.status(202).send(delUser)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
