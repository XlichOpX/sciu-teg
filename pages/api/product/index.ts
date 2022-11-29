import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { productWithCategory } from 'prisma/queries'
import { productSchema } from 'schema/productSchema'
import { canUserDo } from 'utils/checkPermissions'
import { routePaginate, stringSearch } from 'utils/routePaginate'

// GET|POST /api/product
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, query, session } = req

  if (!(await canUserDo(session, 'READ_PRODUCT'))) return res.status(403).send(`Can't read this.`)

  switch (method) {
    case 'GET':
      try {
        const { keyword } = query
        const where = { name: stringSearch(keyword) }
        // obtenemos TODOS los productos
        const result = await prisma.product.findMany({
          ...productWithCategory,
          ...routePaginate(query),
          where,
          orderBy: { name: 'asc' }
        })
        const count = await prisma.product.count({ where })

        return res.json({ count, result })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      // creamos UN producto
      if (!(await canUserDo(session, 'EDIT_PRODUCT')))
        return res.status(403).send(`Can't edit this.`)
      try {
        const data = productSchema.parse(body)
        const result = await prisma.product.create({
          data,
          ...productWithCategory
        })
        return res.status(201).json(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
