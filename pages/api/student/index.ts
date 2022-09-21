import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// POST /api/student
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req
  const result = await prisma.student.create({
    data: {
      ...body
    }
  })

  res.status(201).send(result)
}
