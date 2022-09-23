import { UserStatus } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/userStatus
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los estado de usuario
      const status: UserStatus[] | null = await prisma.userStatus.findMany()

      if (!status) return res.status(404).end(`UserStatus not found`)
      res.status(200).send(status)
      break
    case 'POST':
      //creamos UN estado de usuario
      const result: UserStatus = await prisma.userStatus.create({
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
