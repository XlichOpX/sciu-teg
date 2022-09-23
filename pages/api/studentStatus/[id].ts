import { StudentStatus } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function studentStatusHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN estado de estudiante
      const status: StudentStatus | null = await prisma.studentStatus.findFirst({
        where: { id: Number(id) }
      })
      if (!status) res.status(404).end(`Status not found`)
      res.status(200).send(status)
      break
    case 'PUT':
      //actualizamos a UN estado de estudiante
      const updateStatus: StudentStatus = await prisma.studentStatus.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updateStatus) res.status(404).end(`Status not found`)
      res.status(201).send(updateStatus || {})
      break
    case 'DELETE':
      //eliminamos a UN estado de estudiante
      const delStatus: StudentStatus = await prisma.studentStatus.delete({ where: { id: Number(id) } })
      res.status(202).send(delStatus)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
