import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import prisma from '../../../lib/prisma'

// select base para las query de producto, sirve además para generar el tipo
export const productWithCategory = Prisma.validator<Prisma.ProductArgs>()({
  select: {
    id: true,
    name: true,
    stock: true,
    price: true,
    category: { select: { id: true, name: true } }
  }
})
export type ProductWithCategory = Prisma.ProductGetPayload<typeof productWithCategory>

// schema para validar input tanto de post como put
export const productSchema = z.object({
  name: z.string().min(1).max(64),
  stock: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  categoryId: z.number().int().positive()
})
export type ProductInput = z.infer<typeof productSchema>

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
