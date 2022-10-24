import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(productHandler, ironOptions)

async function productHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    session,
    body,
    method,
    query: { id }
  } = req
  if (!canUnserDo(session, 'READ_PRODUCT')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN producto
      try {
        const product = await prisma.product.findFirst({
          include: { category: true },
          where: { id: Number(id) }
        })
        if (!product) res.status(404).end(`Product not found`)
        res.status(200).send(product)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      //actualizamos a UN producto
      if (!canUnserDo(session, 'EDIT_PRODUCT')) return res.status(403).send(`Can't edit this.`)
      try {
        const updateProduct = await prisma.product.update({
          data: { ...body },
          where: {
            id: Number(id)
          }
        })
        if (!updateProduct) res.status(404).end(`Product not found`)
        res.status(201).send(updateProduct)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      //eliminamos a UN producto
      if (!canUnserDo(session, 'DELETE_PRODUCT')) return res.status(403).send(`Can't delete this.`)
      try {
        const existRelation = await prisma.productSale.count({ where: { productId: Number(id) } })
        if (existRelation > 0) res.status(409).end(`Exists relation receipts`)

        const delProduct = await prisma.product.delete({ where: { id: Number(id) } })
        res.status(202).send(delProduct)
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
