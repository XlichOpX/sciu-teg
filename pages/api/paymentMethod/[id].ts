import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(paymentMethodHandler, ironOptions)
async function paymentMethodHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_PAYMENTMETHOD')))
    return res.status(403).send(`Can't read this.`)
  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN método de pago
      try {
        const paymentMethod = await prisma.paymentMethod.findFirst({
          include: { currency: true },
          where: { id: Number(id) }
        })
        if (!paymentMethod) res.status(404).end(`PaymentMethod not found`)
        res.status(200).send(paymentMethod)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_PAYMENTMETHOD')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN método de pago
      try {
        const paymentMethod = await prisma.paymentMethod.findFirst({
          where: { id: Number(id) }
        })
        if (!paymentMethod) res.status(404).end(`PaymentMethod not found`)
        const updatePaymentMethod = await prisma.paymentMethod.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updatePaymentMethod)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_PAYMENTMETHOD')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN método de pago
      try {
        const charge = await prisma.charge.count({ where: { paymentMethodId: Number(id) } })
        if (charge > 0) return res.status(404).end(`PaymentMethod exists relations`)

        const delPaymentMethod = await prisma.paymentMethod.delete({
          where: { id: Number(id) }
        })
        res.status(202).send(delPaymentMethod)
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
