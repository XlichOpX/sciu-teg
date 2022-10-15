import { User } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { encrypt, secretCrypt } from 'lib/crypter'
import { ironOptions } from 'lib/ironSession'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'
import prisma from '../../../lib/prisma'

// GET|POST /api/user
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  try {
    // es una idea temporal...
    if (!canUnserDo(session, 'ACCESS_USERS_MUTATION'))
      return res.status(403).send(`Can't access this.`)

    switch (method) {
      case 'GET':
        //obtenemos TODOS los usuarios
        const users = await prisma.user.findMany({
          select: { id: true, status: true, username: true }
        })

        if (!users) return res.status(404).end(`Users not found`)
        res.status(200).send(users)
        break
      case 'POST':
        //creamos UN usuario
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
        const result: User = await prisma.user.create({
          data: { ...body }
        })
        res.status(201).send(result)
        break
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
        break
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
