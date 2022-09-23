import { Occupation } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/occupation
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS las ocupaciones de cliente
      const occupations: Occupation[] | null = await prisma.occupation.findMany()

      if (!occupations) return res.status(404).end(`Occupations not found`)
      res.status(200).send(occupations)
      break
    case 'POST':
      //creamos UNA ocupación de cliente
      const result: Occupation = await prisma.occupation.create({
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
