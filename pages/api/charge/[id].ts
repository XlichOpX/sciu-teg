import { Charge } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { chargeWithPaymentMethodAndConversion } from 'prisma/queries'
import z from 'zod'
import prisma from '../../../lib/prisma'

export default async function chargeHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN cargo
      const charge = await prisma.charge.findFirst({
        ...chargeWithPaymentMethodAndConversion,
        where: { id: Number(id) }
      })
      if (!charge) res.status(404).end(`Charge not found`)
      res.status(200).send(charge)
      break
    case 'PUT':
      //actualizamos a UN cargo
      const updateCharge: Charge = await prisma.charge.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updateCharge) res.status(404).end(`Charge not found`)
      res.status(201).send(updateCharge || {})
      break
    case 'DELETE':
      //eliminamos a UN cargo
      const delCharge: Charge = await prisma.charge.delete({ where: { id: Number(id) } })
      res.status(202).send(delCharge)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
