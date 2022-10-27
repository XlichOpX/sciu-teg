import { withIronSessionApiRoute } from 'iron-session/next'
import { encrypt, secretCrypt } from 'lib/crypter'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userEssencials } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'

// GET|POST /api/user
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  // es una idea temporal...
  if (!canUserDo(session, 'ACCESS_USERS_MUTATION'))
    return res.status(403).send(`Can't access this.`)

  switch (method) {
    case 'GET':
      if (!canUserDo(session, 'READ_USER')) return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los usuarios
      try {
        const users = await prisma.user.findMany({
          ...userEssencials
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
      if (!canUserDo(session, 'CREATE_USER')) return res.status(403).send(`Can't create this.`)
      //creamos UN usuario
      try {
        // Validamos los campos
        const { password, secret } = body

        // Hasheamos la contraseña
        const [, cryptoPass] = encrypt(password)
        body.password = cryptoPass

        // Hasheamos las respuestas
        if (secret) {
          secret.create = secretCrypt(secret.create)
        }

        // Creamos al usuario
        const result = await prisma.user.create({
          data: { ...body }
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
