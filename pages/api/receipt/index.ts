import { Receipt } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/receipt
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los recibos
      const receipts: Receipt[] | null = await prisma.receipt.findMany()

      if (!receipts) return res.status(404).end(`Reecipts not found`)
      res.status(200).send(receipts)
      break
    case 'POST':
      //creamos UN recibo
      const result: Receipt = await prisma.receipt.create({
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
