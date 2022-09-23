import { Semester } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function semesterHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN semestre
      const semester: Semester | null = await prisma.semester.findFirst({
        where: { id: Number(id) }
      })
      if (!semester) res.status(404).end(`Semester not found`)
      res.status(200).send(semester)
      break
    case 'PUT':
      //actualizamos a UN semestre
      const updateSemester: Semester = await prisma.semester.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateSemester) res.status(404).end(`Semester not found`)
      res.status(201).send(updateSemester || {})
      break
    case 'DELETE':
      //eliminamos a UN semestre
      const delSemester: Semester = await prisma.semester.delete({ where: { id: Number(id) } })
      res.status(202).send(delSemester)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
