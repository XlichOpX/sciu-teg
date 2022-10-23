import { Person, Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { personListing } from 'prisma/queries'
import { routePaginate, stringSearch } from 'utils/routePaginate'
import prisma from '../../../lib/prisma'

// GET|POST /api/person
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, query } = req

  switch (method) {
    case 'GET':
      try {
        //obtenemos TODAS las personas
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
