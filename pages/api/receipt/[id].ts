import { Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'
import z from 'zod'
import prisma from '../../../lib/prisma'

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

  if (!canUnserDo(session, 'READ_RECEIPT')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN recibo
      const receipt = await prisma.receipt.findFirst({
        select: {
          amount: true,
          chargedProducts: {
            select: {
              id: true,
              price: true,
              product: { select: { name: true } },
              quantity: true
            }
          },
          charges: {
            select: {
              amount: true,
              conversion: { select: { dolar: true, euro: true } },
              id: true,
              paymentMethod: {
                select: {
                  currency: { select: { name: true, symbol: true } },
                  name: true,
                  id: true
                }
              }
            }
          },
          createdAt: true,
          id: true,
          person: {
            select: {
              address: { select: { shortAddress: true } },
              docNumber: true,
              docType: { select: { type: true } },
              firstLastName: true,
              firstName: true,
              middleName: true,
              secondLastName: true
            }
          }
        },
        where: { id: Number(id) }
      })
      if (!receipt) res.status(404).end(`Receipt not found`)
      res.status(200).send(receipt)
      break
    case 'PUT':
      if (!canUnserDo(session, 'EDIT_RECEIPT')) return res.status(403).send(`Can't edit this.`)
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
      if (!canUnserDo(session, 'DELETE_RECEIPT')) return res.status(403).send(`Can't delete this.`)
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
