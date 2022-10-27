import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req
  if (!canUserDo(session, 'READ_CURRENCY')) return res.status(403).send(`Can't read this.`)
  switch (method) {
    case 'GET':
      try {
        const currencies = await prisma.currency.findMany()
        res.status(200).json(currencies)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUserDo(session, 'CREATE_CURRENCY')) return res.status(403).send(`Can't create this.`)
      try {
        const result = await prisma.currency.create({
          data: { ...body }
        })
        res.status(201).json(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).send(`Method ${method} Not Allowed`)
      break
  }
}
