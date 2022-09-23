import { Client } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/client
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS los clientes
      const clients: Client[] | null = await prisma.client.findMany({
        include: { person: true, occupation: true }
      })

      if (!clients) return res.status(404).end(`Clients not found`)
      res.status(200).send(clients)
      break
    case 'POST':
      //creamos UN cliente
      const result: Client = await prisma.client.create({
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
