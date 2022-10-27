import { Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { receiptWithAll } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(receiptHandler, ironOptions)

async function receiptHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    session,
    query: { id }
  } = req

  if (!canUserDo(session, 'READ_RECEIPT')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN recibo

      const receipt = await prisma.receipt.findFirst({
        ...receiptWithAll,
        where: { id: Number(id) }
      })
      if (!receipt) res.status(404).end(`Receipt not found`)
      res.status(200).send(receipt)
      break
    case 'PUT':
      if (!canUserDo(session, 'EDIT_RECEIPT')) return res.status(403).send(`Can't edit this.`)
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
      if (!canUserDo(session, 'DELETE_RECEIPT')) return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN recibo
      const existRelation = await prisma.charge.count({ where: { receiptId: Number(id) } })

      if (existRelation > 0) res.status(409).end(`Exists relation charges`)

      const delReceipt: Receipt = await prisma.receipt.delete({ where: { id: Number(id) } })
      res.status(202).send(delReceipt)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
