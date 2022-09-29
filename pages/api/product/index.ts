import { Product, Category } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/product
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      // obtenemos TODOS los productos
      const products : ProductWithCategory[]  = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          stock: true,
          price: true,
          categoryId : true,
          category: {select: {name: true}}
        }
      })
      return res.json(products)
    case 'POST':
      // creamos UN producto
      const result: Product = await prisma.product.create({
        data: { ...body }
      })
      return res.status(201).send(result)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export type ProductWithCategory = (Product & {category: Omit<Category, 'description' | 'id'> })