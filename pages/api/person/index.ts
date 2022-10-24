import { Person, Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { personListing } from 'prisma/queries'
import { canUnserDo } from 'utils/checkPermissions'
import { routePaginate, stringSearch } from 'utils/routePaginate'

// GET|POST /api/person
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, query, session } = req

  switch (method) {
    case 'GET':
      if (!canUnserDo(session, 'READ_PERSON')) return res.status(403).send(`Can't read this.`)
      //obtenemos TODAS las personas
      try {
        const { keyword } = query
        const searchQuery = stringSearch(keyword)
        const where: Prisma.PersonWhereInput = keyword
          ? {
              OR: [
                { docNumber: searchQuery },
                { firstName: searchQuery },
                { middleName: searchQuery },
                { secondLastName: searchQuery },
                { firstLastName: searchQuery }
              ]
            }
          : {}

        const result = await prisma.person.findMany({
          ...personListing,
          ...routePaginate(query),
          where
        })

        if (!result) res.status(404).end(`People not found`)
        const count = await prisma.person.count({ where })
        return res.json({ count, result })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUnserDo(session, 'CREATE_PERSON')) return res.status(403).send(`Can't create this.`)
      //creamos UNA persona
      try {
        const result: Person = await prisma.person.create({
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
