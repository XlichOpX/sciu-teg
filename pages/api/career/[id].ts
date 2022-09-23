import { Career } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function careerHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UNA carrera
      const career: Career | null = await prisma.career.findFirst({
        where: { id: Number(id) }
      })
      if (!career) res.status(404).end(`Career not found`)
      res.status(200).send(career)
      break
    case 'PUT':
      //actualizamos a UNA carrera
      const updateCareer: Career = await prisma.career.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateCareer) res.status(404).end(`Career not found`)
      res.status(201).send(updateCareer || {})
      break
    case 'DELETE':
      //eliminamos a UNA carrera
      const delCareer: Career = await prisma.career.delete({ where: { id: Number(id) } })
      res.status(202).send(delCareer)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
