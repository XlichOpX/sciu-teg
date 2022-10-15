import { Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'
import { routePaginate, search } from 'utils/routePaginate'

// GET|POST /api/receipt
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, query, session } = req

  switch (method) {
    case 'GET':
      if (!canUnserDo(session, 'READ_RECEIPT')) return res.status(403).send(`Can't read this.`)
      // destructuring limit and offset values from query params
      const { keyword, document } = query
      const searchQuery = search(keyword)
      // obtenemos TODOS los productos

      const where: Prisma.ReceiptWhereInput = {
        person: { docNumber: document ? search(document) : document },
        OR: [
          { person: { firstName: searchQuery } },
          { person: { middleName: searchQuery } },
          { person: { secondLastName: searchQuery } },
          { person: { firstLastName: searchQuery } }
        ]
      }

      const count = await prisma.receipt.count({ where })
      //obtenemos TODOS los recibos
      // Recibos con información escencial de la persona
      const result = await prisma.receipt.findMany({
        select: {
          amount: true,
          createdAt: true,
          id: true,
          person: {
            select: {
              docType: { select: { type: true } },
              docNumber: true,
              firstName: true,
              firstLastName: true
            }
          }
        },
        ...routePaginate(query),
        where
      })

      res.json({ count, result })
      break
    case 'POST':
      if (!canUnserDo(session, 'CREATE_RECEIPT')) return res.status(403).send(`Can't create this.`)
      //creamos UN recibo
      try {
        const result = await prisma.receipt.create({
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
