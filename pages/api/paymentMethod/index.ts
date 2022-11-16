import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  paymentMethodWithCurrencies,
  paymentMethodWithCurrenciesWithoutDetails
} from 'prisma/queries'
import { paymentMethodCreateSchema } from 'schema/paymentMethodSchema'
import { canUserDo } from 'utils/checkPermissions'

// GET|POST /api/paymentMethod
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_PAYMENTMETHOD')))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los métodos de pago
      try {
        const paymentMethod = await prisma.paymentMethod.findMany({
          ...paymentMethodWithCurrenciesWithoutDetails
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
      if (!(await canUserDo(session, 'CREATE_PAYMENTMETHOD')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN método de pago
      try {
        // Validate Body
        const validBody = paymentMethodCreateSchema.safeParse(body)
        if (!validBody.success) return res.status(400).send(`Invalid Request`)

        const { currencies } = validBody.data
        const result = await prisma.paymentMethod.create({
          data: { ...validBody.data, currencies: { connect: currencies } },
          ...paymentMethodWithCurrencies
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
