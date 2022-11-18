import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { categoryWithRelationalProducts } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())
  const {
    method,
    query: { id },
    session
  } = req

  if (!(await canUserDo(session, 'READ_PRODUCT'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)
  switch (method) {
    case 'GET':
      //obtenemos a UNA categoría
      try {
        const category = await prisma.category.findMany({
          ...categoryWithRelationalProducts,
          where: { id: Number(id) }
        })
        if (!category) res.status(404).end(`Products where categoryId is ${id} not found`)
        res.status(200).send(category[0])
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
