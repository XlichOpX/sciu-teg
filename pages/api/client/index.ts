import { Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { clientWithPersonAndOccupation } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import { routePaginate, stringSearch } from 'utils/routePaginate'

// GET|POST /api/client
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session, query } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS los clientes
      if (!(await canUserDo(session, 'READ_CLIENT')))
        return res.status(403).send(`Can't read this.`)
      try {
        const { keyword } = query
        const searchQuery = stringSearch(keyword)
        const where: Prisma.StudentWhereInput = keyword
          ? {
              OR: [
                { person: { docNumber: searchQuery } },
                { person: { firstName: searchQuery } },
                { person: { middleName: searchQuery } },
                { person: { secondLastName: searchQuery } },
                { person: { firstLastName: searchQuery } }
              ]
            }
          : {}
        const result = await prisma.client.findMany({
          ...clientWithPersonAndOccupation,
          ...routePaginate(query),
          where
        })

        const count = await prisma.client.count({ where })
        res.status(200).send({ count, result })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUserDo(session, 'CREATE_CLIENT')) return res.status(403).send(`Can't create this.`)
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
