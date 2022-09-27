import { Permission } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/permission
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los permisos
      const permissions: Permission[] | null = await prisma.permission.findMany()

      if (!permissions) return res.status(404).end(`Permissions not found`)
      res.status(200).send(permissions)
      break
    case 'POST':
      //creamos UN permiso
      const result: Permission = await prisma.permission.create({
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
