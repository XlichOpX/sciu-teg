import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/occupation
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    method,
    session,
    query: { keyword }
  } = req

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_OCCUPATION')))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODAS las ocupaciones de cliente
      try {
        const occupations = await prisma.occupation.findMany({
          where: { occupation: stringSearch(keyword) }
        })

        if (!occupations) return res.status(404).end(`Occupations not found`)
        res.status(200).send(occupations)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_OCCUPATION')))
        return res.status(403).send(`Can't create this.`)
      try {
        //creamos UNA ocupación de cliente
        const result = await prisma.occupation.create({
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
