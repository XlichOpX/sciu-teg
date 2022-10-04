import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      const currencies = await prisma.currency.findMany()
      res.status(200).json(currencies)
      break
    case 'POST':
      const result = await prisma.currency.create({
        data: { ...body }
      })
      res.status(201).json(result)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).send(`Method ${method} Not Allowed`)
      break
  }
}
