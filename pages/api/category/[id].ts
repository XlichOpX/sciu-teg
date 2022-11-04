import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(categoryHandler, ironOptions)

async function categoryHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())
  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_CATEGORY'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)
  switch (method) {
    case 'GET':
      //obtenemos a UNA categoría
      try {
        const category = await prisma.category.findFirst({
          where: { id: Number(id) }
        })
        if (!category) res.status(404).end(`Category not found`)
        res.status(200).send(category)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_CATEGORY')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA categoría
      try {
        const category = await prisma.category.findFirst({
          where: { id: Number(id) }
        })
        if (!category) res.status(404).end(`Category not found`)
        const updateCategory = await prisma.category.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateCategory)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_CATEGORY')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA categoría
      try {
        const product = await prisma.product.count({ where: { categoryId: Number(id) } })
        if (product > 0) return res.status(409).end(`Exists relation products`)
        const delCategory = await prisma.category.delete({ where: { id: Number(id) } })
        res.status(202).send(delCategory)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
