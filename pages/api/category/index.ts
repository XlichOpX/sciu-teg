import { Category } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'

// GET|POST /api/category
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req
  if (!canUserDo(session, 'READ_CATEGORY')) return res.status(403).send(`Can't read this.`)

  switch (method) {
    case 'GET':
      //obtenemos TODAS las categorias
      try {
        const categories = await prisma.category.findMany()
        if (!categories) return res.status(404).end(`Categories not found`)
        res.status(200).send(categories)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUserDo(session, 'CREATE_CATEGORY')) return res.status(403).send(`Can't create this.`)
      //creamos UNA categoría
      try {
        const result: Category = await prisma.category.create({
          data: { ...body }
        })
        res.status(201).send(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
