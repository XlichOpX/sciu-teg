import { Conversion } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/conversion
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS las conversiones
      const conversions: Conversion[] | null = await prisma.conversion.findMany()

      if (!conversions) return res.status(404).end(`Conversions not found`)
      res.status(200).send(conversions)
      break
    case 'POST':
      //creamos UNA conversión
      const result: Conversion = await prisma.conversion.create({
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
