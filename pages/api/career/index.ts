import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/career
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    method,
    query: { keyword },
    session
  } = req
  if (!(await canUserDo(session, 'READ_CAREER'))) return res.status(403).send(`Can't read this.`)

  switch (method) {
    case 'GET':
      try {
        //obtenemos TODAS las carreras
        const careers = await prisma.career.findMany({
          where: { career: stringSearch(keyword) },
          orderBy: { career: 'asc' }
        })

        if (!careers) res.status(404).end(`Careers not found`)
        res.status(200).send(careers)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_CAREER')))
        return res.status(403).send(`Can't create this.`)
      try {
        //creamos una carrera
        const result = await prisma.career.create({
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
