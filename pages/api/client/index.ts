import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { clientWithPersonAndOccupation } from 'prisma/queries'
import { canUnserDo } from 'utils/checkPermissions'

// GET|POST /api/client
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS los clientes
      if (!canUnserDo(session, 'READ_CLIENT')) return res.status(403).send(`Can't read this.`)
      try {
        const clients = await prisma.client.findMany({
          ...clientWithPersonAndOccupation
        })
        if (!clients) return res.status(404).end(`Clients not found`)
        res.status(200).send(clients)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUnserDo(session, 'CREATE_CLIENT')) return res.status(403).send(`Can't create this.`)
      //creamos UN cliente
      try {
        const result = await prisma.client.create({
          data: { ...body },
          ...clientWithPersonAndOccupation
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
