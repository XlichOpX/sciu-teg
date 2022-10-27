import { Role } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { roleWithPermissions } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/role
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
      if (!canUserDo(session, 'READ_ROLE')) return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los roles
      try {
        const roles = await prisma.role.findMany({
          ...roleWithPermissions,
          where: { name: stringSearch(keyword) }
        })
        res.status(200).send(roles)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUserDo(session, 'CREATE_ROLE')) return res.status(403).send(`Can't create this.`)
      //creamos UN rol
      try {
        const result: Role = await prisma.role.create({
          data: { ...body },
          ...roleWithPermissions
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
