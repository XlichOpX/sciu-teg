import { PaymentMethod } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/paymentMethod
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los métodos de pago
      const paymentMethod: PaymentMethod[] | null = await prisma.paymentMethod.findMany({
        include: { currency: { select: { name: true, symbol: true } } }
      })

      if (!paymentMethod) return res.status(404).end(`PaymentMethods not found`)
      res.status(200).send(paymentMethod)
      break
    case 'POST':
      //creamos UN método de pago
      const result: PaymentMethod = await prisma.paymentMethod.create({
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
