import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { paymentMethodWithConversion } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'

// GET|POST /api/paymentMethod
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  switch (method) {
    case 'GET':
      if (!canUserDo(session, 'READ_PAYMENTMETHOD')) return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los métodos de pago
      try {
        const paymentMethod = await prisma.paymentMethod.findMany({
          ...paymentMethodWithConversion
        })

        if (!paymentMethod) return res.status(404).end(`PaymentMethods not found`)
        res.status(200).send(paymentMethod)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUserDo(session, 'CREATE_PAYMENTMETHOD'))
        return res.status(403).send(`Can't create this.`)
      //creamos UN método de pago
      try {
        const result = await prisma.paymentMethod.create({
          data: { ...body },
          ...paymentMethodWithConversion
        })
        res.status(201).send(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
