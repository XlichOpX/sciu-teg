import type { NextApiRequest, NextApiResponse } from 'next'
import { Student } from '@prisma/client'
import prisma from '../../../lib/prisma'

export default async function studentHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body
  } = req

  if (isNaN(id as unknown as number)) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN estudiante
      const student: Student | null = await prisma.student.findFirst({
        include: { person: true, status: true },
        where: { id: Number(id) }
      })
      if(!student)
        res.status(404).end(`Student not found`)

      break
    case 'PUT':
      //actualizamos a UN estudiante
      const updateStudent: Student | null = await prisma.student.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      res.status(201).send(updateStudent || {})
      break
    case 'DELETE':
      //eliminamos a UN estudiante
      const delStudent: Student | null = await prisma.student.delete({ where: { id: Number(id) } })
      res.status(202).send(delStudent)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
