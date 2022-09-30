import { Prisma } from '@prisma/client'
import { productSchema } from 'schema/productSchema'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export const productWithCategory = Prisma.validator<Prisma.ProductArgs>()({
  select: {
    id: true,
    name: true,
    stock: true,
    price: true,
    category: { select: { id: true, name: true } }
  }
})


// GET|POST /api/product
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      // obtenemos TODOS los productos
      const products = await prisma.product.findMany(productWithCategory)
      return res.json(products)
    case 'POST':
      // creamos UN producto
      try {
        const data = productSchema.parse(body)
        const result = await prisma.product.create({
          data,
          select: productWithCategory.select
        })
        return res.status(201).json(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error })
        }
      }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
