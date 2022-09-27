import { Address } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/address
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS las direcciones
      const addresses: Address[] | null = await prisma.address.findMany()

      if (!addresses) return res.status(404).end(`Addresses not found`)
      res.status(200).send(addresses)
      break
    case 'POST':
      //creamos UNA dirección
      const result: Address = await prisma.address.create({
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
