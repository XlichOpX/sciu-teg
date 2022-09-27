import { Charge } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/charge
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los cargos
      const charges: Charge[] | null = await prisma.charge.findMany()

      if (!charges) return res.status(404).end(`Charges not found`)
      res.status(200).send(charges)
      break
    case 'POST':
      //creamos UN cargo
      const result: Charge = await prisma.charge.create({
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
