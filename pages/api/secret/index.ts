import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'

// GET|POST /api/secret
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  switch (method) {
    case 'GET':
      if (!canUnserDo(session, 'READ_SECRET')) return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los secretos
      try {
        const secrets = await prisma.secret.findMany()
        res.status(200).send(secrets)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUnserDo(session, 'CREATE_SECRET')) return res.status(403).send(`Can't create this.`)
      //creamos UN secreto
      try {
        const result = await prisma.secret.create({
          data: { ...body }
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
