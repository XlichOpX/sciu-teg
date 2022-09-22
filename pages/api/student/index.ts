import { Student } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// POST /api/student
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los estudiantes
      const students: Student[] | null = await prisma.student.findMany({
        include: { person: true, career: true }
      })
      if (!students) res.status(404).end(`Students not found`)
      res.status(200).send(students)
      break
    case 'POST':
      const result = await prisma.student.create({
        data: {
          ...body
        }
      })
      res.status(201).send(result)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
