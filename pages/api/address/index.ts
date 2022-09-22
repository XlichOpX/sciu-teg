import { Address } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/address
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      const addresses = await prisma.address.findMany()

      if (!addresses) return res.status(404).end(`Not Addresses found`)
      res.status(200).send(addresses)
      break
    case 'POST':
      const newAddress = await prisma.address.create({
        data: { ...body }
      })
      res.status(201).send(newAddress)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
