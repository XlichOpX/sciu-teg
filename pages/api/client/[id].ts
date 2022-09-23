import { Client } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function clientHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN cliente
      const client: Client | null = await prisma.client.findFirst({
        where: { id: Number(id) }
      })
      if (!client) res.status(404).end(`Client not found`)
      res.status(200).send(client)
      break
    case 'PUT':
      //actualizamos a UN cliente
      const updateClient: Client = await prisma.client.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateClient) res.status(404).end(`Client not found`)
      res.status(201).send(updateClient || {})
      break
    case 'DELETE':
      //eliminamos a UN cliente
      const delClient: Client = await prisma.client.delete({ where: { id: Number(id) } })
      res.status(202).send(delClient)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
