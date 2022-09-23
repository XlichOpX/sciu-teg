import { Semester } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/semester
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los semestres
      const semesters: Semester[] | null = await prisma.semester.findMany()

      if (!semesters) return res.status(404).end(`Semesters not found`)
      res.status(200).send(semesters)
      break
    case 'POST':
      //creamos UN semestre
      const result: Semester = await prisma.semester.create({
        data: { ...body }
      })
      res.status(201).send(result)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
