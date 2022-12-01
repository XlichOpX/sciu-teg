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

  if (!(await canUserDo(session, 'READ_RECEIPT'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN recibo

      try {
        const receipt = await prisma.receipt.findFirst({
          ...receiptWithAll,
          where: { id: Number(id) }
        })
        if (!receipt) return res.status(404).end(`Receipt not found`)
        res.status(200).send(receipt)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }

      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_RECEIPT')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN recibo
      try {
        const receipt = await prisma.receipt.findFirst({ where: { id: Number(id) } })
        if (!receipt) return res.status(404).end(`Receipt not found`)

        const updateReceipt = await prisma.receipt.update({
          data: { ...body },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateReceipt)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_RECEIPT')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN recibo
      try {
        const receipt = await prisma.receipt.findFirst({ where: { id: Number(id) } })
        if (!receipt) return res.status(404).end(`Receipt not found`)

        const charge = await prisma.charge.count({ where: { receiptId: Number(id) } })
        if (charge > 0) return res.status(409).end('Error relationships exist')

        const delReceipt = await prisma.receipt.delete({ where: { id: Number(id) } })
        res.status(202).send(delReceipt)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
