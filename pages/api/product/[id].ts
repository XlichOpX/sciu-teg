import { Product } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function productHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id }
  } = req

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN producto
      const product: Product | null = await prisma.product.findFirst({
        include: { category: true },
        where: { id: Number(id) }
      })
      if (!product) res.status(404).end(`Product not found`)
      res.status(200).send(product)
      break
    case 'PUT':
      //actualizamos a UN producto
      const updateProduct: Product = await prisma.product.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updateProduct) res.status(404).end(`Product not found`)
      res.status(201).send(updateProduct || {})
      break
    case 'DELETE':
      //eliminamos a UN producto 
      const existRelation = await prisma.productSale.count({where: { productId: Number(id)}})
      
      if( existRelation > 0 )
        res.status(409).end(`Exists relation receipts`)

      const delProduct: Product = await prisma.product.delete({ where: { id: Number(id) } })
      res.status(202).send(delProduct)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
