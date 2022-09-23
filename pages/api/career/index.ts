import { Career } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/career
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS las carreras
      const careers: Career[] | null = await prisma.career.findMany()

      if (!careers) res.status(404).end(`Careers not found`)
      res.status(200).send(careers)
      break
    case 'POST':
      //creamos una carrera
      const result = await prisma.career.create({
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
