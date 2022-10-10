import { Student } from '@prisma/client'
import prisma from '../../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function studentHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN estudiante
      const student: Student | null = await prisma.student.findFirst({
        include: { person: true, status: true, career: true, enrolledSemesters: true },
        where: { id: Number(id) }
      })
      if (!student) res.status(404).end(`Student not found`)
      res.status(200).send(student)
      break
    case 'PUT':
      //actualizamos a UN estudiante
      const updateStudent: Student = await prisma.student.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updateStudent) res.status(404).end(`Student not found`)
      res.status(201).send(updateStudent || {})
      break
    case 'DELETE':
      //eliminamos a UN estudiante
      const delStudent: Student = await prisma.student.delete({ where: { id: Number(id) } })
      res.status(202).send(delStudent)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
