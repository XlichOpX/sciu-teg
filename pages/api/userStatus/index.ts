import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/userStatus
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
      if (!(await canUserDo(session, 'READ_USERSTATUS')))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los estado de usuario
      try {
        const status = await prisma.userStatus.findMany({
          where: { description: stringSearch(keyword) },
          orderBy: { status: 'asc' }
        })

        if (!status) return res.status(404).end(`UserStatus not found`)
        res.status(200).send(status)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_USERSTATUS')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN estado de usuario
      try {
        const result = await prisma.userStatus.create({
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
