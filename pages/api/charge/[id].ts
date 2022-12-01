import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { chargeWithPaymentMethodAndCurrencies } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(chargeHandler, ironOptions)
async function chargeHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_CHARGE'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN cargo
      try {
        const charge = await prisma.charge.findFirst({
          ...chargeWithPaymentMethodAndCurrencies,
          where: { id: Number(id) }
        })
        if (!charge) return res.status(404).end(`Charge not found`)
        res.status(200).send(charge)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_CHARGE')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN cargo
      try {
        const charge = await prisma.charge.findFirst({
          where: { id: Number(id) }
        })
        if (!charge) return res.status(404).end(`Charge not found`)
        const updateCharge = await prisma.charge.update({
          data: { ...body },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateCharge)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_CHARGE')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN cargo
      try {
        const charge = await prisma.charge.findFirst({ where: { id: Number(id) } })
        if (!charge) return res.status(404).end(`Charge not found`)

        const delCharge = await prisma.charge.delete({ where: { id: Number(id) } })
        res.status(202).send(delCharge)
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
