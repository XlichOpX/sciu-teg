import { Product } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/product
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los productos
      const products: Product[] | null = await prisma.product.findMany()

      if (!products) return res.status(404).end(`Products not found`)
      res.status(200).send(products)
      break
    case 'POST':
      //creamos UN productos
      const result: Product = await prisma.product.create({
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
