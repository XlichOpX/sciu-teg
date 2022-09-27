import { User } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN usuario
      const user: User | null = await prisma.user.findFirst({
        where: { id: Number(id) }
      })
      if (!user) res.status(404).end(`User not found`)
      res.status(200).send(user)
      break
    case 'PUT':
      //actualizamos a UN usuario
      const updateUser: User = await prisma.user.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateUser) res.status(404).end(`User not found`)
      res.status(201).send(updateUser || {})
      break
    case 'DELETE':
      //eliminamos a UN usuario
      const delUser: User = await prisma.user.delete({ where: { id: Number(id) } })
      res.status(202).send(delUser)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
