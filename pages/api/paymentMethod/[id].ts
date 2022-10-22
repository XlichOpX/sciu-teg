import { PaymentMethod } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'
import prisma from '../../../lib/prisma'

export default async function paymentMethodHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN método de pago
      const paymentMethod = await prisma.paymentMethod.findFirst({
        include: { currency: true },
        where: { id: Number(id) }
      })
      if (!paymentMethod) res.status(404).end(`PaymentMethod not found`)
      res.status(200).send(paymentMethod)
      break
    case 'PUT':
      //actualizamos a UN método de pago
      const updateAddress: PaymentMethod = await prisma.paymentMethod.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateAddress) res.status(404).end(`PaymentMethod not found`)
      res.status(201).send(updateAddress || {})
      break
    case 'DELETE':
      //eliminamos a UN método de pago
      const delAddress: PaymentMethod = await prisma.paymentMethod.delete({
        where: { id: Number(id) }
      })
      res.status(202).send(delAddress)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
