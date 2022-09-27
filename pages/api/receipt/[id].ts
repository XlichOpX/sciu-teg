import { Receipt } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function receiptHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN recibo
      const receipt: Receipt | null = await prisma.receipt.findFirst({
        where: { id: Number(id) }
      })
      if (!receipt) res.status(404).end(`Receipt not found`)
      res.status(200).send(receipt)
      break
    case 'PUT':
      //actualizamos a UN recibo
      const updateReceipt: Receipt = await prisma.receipt.update({
        data: { ...body },
        where: {
          id: Number(id)
        }
      })
      if (!updateReceipt) res.status(404).end(`Receipt not found`)
      res.status(201).send(updateReceipt || {})
      break
    case 'DELETE':
      //eliminamos a UN recibo
      const delReceipt: Receipt = await prisma.receipt.delete({ where: { id: Number(id) } })
      res.status(202).send(delReceipt)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
