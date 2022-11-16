import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { conversionWithCurrency } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, session } = req

  if (!(await canUserDo(session, 'READ_CONVERSION')))
    return res.status(403).send(`Can't read this.`)

  switch (method) {
    case 'GET':
      try {
        const result = await prisma.conversion.findMany({
          ...conversionWithCurrency,
          distinct: ['currencyId'],
          orderBy: { date: 'desc' }
        })

        res.status(200).json(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
