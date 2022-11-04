import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'

// GET|POST /api/parameters
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session } = req

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_PARAMETER')))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los parámetros
      try {
        const parameters = await prisma.parameters.findMany()

        if (!parameters) return res.status(404).end(`Parameters not found`)
        res.status(200).send(parameters)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_PARAMETER')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN parámetro
      try {
        const result = await prisma.parameters.create({
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
