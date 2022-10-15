import { Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { productSchema } from 'schema/productSchema'
import { canUnserDo } from 'utils/checkPermissions'

export const productWithCategory = Prisma.validator<Prisma.ProductArgs>()({
  select: {
    id: true,
    name: true,
    stock: true,
    price: true,
    categoryId: true,
    category: { select: { name: true } }
  }
})

// GET|POST /api/product
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, query, session } = req

  if (!canUnserDo(session, 'READ_PRODUCT')) return res.status(403).send(`Can't read this.`)

  switch (method) {
    case 'GET':
      // destructuring limit and offset values from query params
      const { limit, offset, keyword } = query

      // validate values to pagination
      const take = Number(Array.isArray(limit) ? limit[0] : limit) || 5
      const skip = Number(Array.isArray(offset) ? offset[0] : offset) || 0
      const search: Prisma.ProductWhereInput = {
        name: { contains: Array.isArray(keyword) ? keyword[0] : keyword, mode: 'insensitive' }
      }
      // obtenemos TODOS los productos
      const products = await prisma.product.findMany({
        ...productWithCategory,
        take,
        skip,
        where: search,
        orderBy: { name: 'asc' }
      })
      const count = await prisma.product.count({ where: search })
      return res.json({ count, result: products })
    case 'POST':
      // creamos UN producto
      if (!canUnserDo(session, 'EDIT_PRODUCT')) return res.status(403).send(`Can't edit this.`)
      try {
        const data = productSchema.parse(body)
        const result = await prisma.product.create({
          data,
          select: productWithCategory.select
        })
        return res.status(201).json(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
