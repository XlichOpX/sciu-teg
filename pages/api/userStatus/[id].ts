import { UserStatus } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function studentStatusHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN estado de usuario
      const status: UserStatus | null = await prisma.userStatus.findFirst({
        where: { id: Number(id) }
      })
      if (!status) res.status(404).end(`Status not found`)
      res.status(200).send(status)
      break
    case 'PUT':
      //actualizamos a UN estado de usuario
      const updateStatus: UserStatus = await prisma.userStatus.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updateStatus) res.status(404).end(`Status not found`)
      res.status(201).send(updateStatus || {})
      break
    case 'DELETE':
      //eliminamos a UN estado de usuario
      const delStatus: UserStatus = await prisma.userStatus.delete({ where: { id: Number(id) } })
      res.status(202).send(delStatus)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
