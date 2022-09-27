import { Category } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/category
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS las categorias
      const categories: Category[] | null = await prisma.category.findMany()

      if (!categories) return res.status(404).end(`Addresses not found`)
      res.status(200).send(categories)
      break
    case 'POST':
      //creamos UNA categoría
      const result: Category = await prisma.category.create({
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
