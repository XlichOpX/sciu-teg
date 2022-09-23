import { Occupation } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function occupationHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UNA ocupación de cliente
      const occupation: Occupation | null = await prisma.occupation.findFirst({
        where: { id: Number(id) }
      })
      if (!occupation) res.status(404).end(`Occupation not found`)
      res.status(200).send(occupation)
      break
    case 'PUT':
      //actualizamos a UNA ocupación de cliente
      const updateOccupation: Occupation = await prisma.occupation.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateOccupation) res.status(404).end(`Occupation not found`)
      res.status(201).send(updateOccupation || {})
      break
    case 'DELETE':
      //eliminamos a UNA ocupación de cliente
      const delOccupation: Occupation = await prisma.occupation.delete({
        where: { id: Number(id) }
      })
      res.status(202).send(delOccupation)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
