import { Conversion } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import { dateTimeSearch, routePaginate } from 'utils/routePaginate'

// GET|POST /api/conversion
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, session, query } = req
  if (!canUserDo(session, 'READ_CONVERSION')) return res.status(403).send(`Can't read this.`)
  switch (method) {
    case 'GET':
      try {
        const { after } = query

        const where = { date: dateTimeSearch(after) }

        //obtenemos TODAS las conversiones
        const result = await prisma.conversion.findMany({
          ...routePaginate(query),
          where,
          orderBy: {
            date: 'desc'
          }
        })

        const count = await prisma.conversion.count({ where })

        res.status(200).send({ count, result })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUserDo(session, 'EDIT_CONVERSION')) return res.status(403).send(`Can't edit this.`)
      try {
        //creamos UNA conversión
        const result: Conversion = await prisma.conversion.create({
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
