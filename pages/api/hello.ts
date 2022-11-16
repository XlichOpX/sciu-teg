// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await prisma.conversion.findMany({
    select: {
      value: true,
      date: true,
      id: true,
      currency: { select: { id: true, name: true, symbol: true } }
    },
    distinct: ['currencyId'],
    orderBy: { date: 'desc' }
  })

  res.status(200).json(result)
}
