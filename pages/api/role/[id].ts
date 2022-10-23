import { Role } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { roleWithPermissions } from 'prisma/queries'
import z from 'zod'
import prisma from '../../../lib/prisma'

export default async function roleHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN rol

      const role = await prisma.role.findFirst({
        ...roleWithPermissions,
        where: { id: Number(id) }
      })
      if (!role) res.status(404).end(`Role not found`)
      res.status(200).send(role)
      break
    case 'PUT':
      //actualizamos a UN rol
      const updateRole: Role = await prisma.role.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateRole) res.status(404).end(`Role not found`)
      res.status(201).send(updateRole || {})
      break
    case 'DELETE':
      //eliminamos a UN rol
      const delRole: Role = await prisma.role.delete({ where: { id: Number(id) } })
      res.status(202).send(delRole)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
