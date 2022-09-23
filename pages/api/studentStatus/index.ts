import { StudentStatus } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/studentStatus
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los estado de estudiantes
      const status: StudentStatus[] | null = await prisma.studentStatus.findMany()

      if (!status) return res.status(404).end(`Student Status not found`)
      res.status(200).send(status)
      break
    case 'POST':
      //creamos UN estado de estudiante
      const result: StudentStatus = await prisma.studentStatus.create({
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
