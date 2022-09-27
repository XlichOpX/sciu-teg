import { Parameters } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/parameters
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los parámetros
      const parameters: Parameters[] | null = await prisma.parameters.findMany()

      if (!parameters) return res.status(404).end(`Parameters not found`)
      res.status(200).send(parameters)
      break
    case 'POST':
      //creamos UN parámetro
      const result: Parameters = await prisma.parameters.create({
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
