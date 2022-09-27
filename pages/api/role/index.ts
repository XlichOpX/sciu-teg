import { Role } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/role
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los roles
      const roles: Role[] | null = await prisma.role.findMany()

      if (!roles) return res.status(404).end(`Roles not found`)
      res.status(200).send(roles)
      break
    case 'POST':
      //creamos UN rol
      const result: Role = await prisma.role.create({
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
