import { User } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los usuarios
      const users: User[] | null = await prisma.user.findMany()

      if (!users) return res.status(404).end(`Users not found`)
      res.status(200).send(users)
      break
    case 'POST':
      //creamos UN usuario
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
}
