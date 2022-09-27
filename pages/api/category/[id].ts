import { Category } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function categoryHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UNA categoría
      const category: Category | null = await prisma.category.findFirst({
        where: { id: Number(id) }
      })
      if (!category) res.status(404).end(`Category not found`)
      res.status(200).send(category)
      break
    case 'PUT':
      //actualizamos a UNA categoría
      const updateCategory: Category = await prisma.category.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateCategory) res.status(404).end(`Category not found`)
      res.status(201).send(updateCategory || {})
      break
    case 'DELETE':
      //eliminamos a UNA categoría
      const delCategory: Category = await prisma.category.delete({ where: { id: Number(id) } })
      res.status(202).send(delCategory)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
