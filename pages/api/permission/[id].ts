import { Permission } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function permissionHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id }
  } = req

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN Permiso
      const permission: Permission | null = await prisma.permission.findFirst({
        where: { id: Number(id) }
      })
      if (!permission) res.status(404).end(`Permission not found`)
      res.status(200).send(permission)
      break
    case 'PUT':
      //actualizamos a UN Permiso
      const updatePermission: Permission = await prisma.permission.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updatePermission) res.status(404).end(`Permission not found`)
      res.status(201).send(updatePermission || {})
      break
    case 'DELETE':
      //eliminamos a UN Permiso
      const delPermission: Permission = await prisma.permission.delete({ where: { id: Number(id) } })
      res.status(202).send(delPermission)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
