import { Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { studentWithPersonCareerAndStatus } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import { routePaginate, stringSearch } from 'utils/routePaginate'

// GET|POST /api/student
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session, query } = req

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_STUDENT')))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los estudiantes
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

        const result = await prisma.student.findMany({
          ...studentWithPersonCareerAndStatus,
          ...routePaginate(query),
          where,
          orderBy: {
            person: { firstLastName: 'asc', firstName: 'asc' }
          }
        })

        const count = await prisma.student.count({ where })
        res.status(200).send({ count, result })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_STUDENT')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN estudiante
      try {
        const result = await prisma.student.create({
          data: { ...body },
          ...studentWithPersonCareerAndStatus
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
