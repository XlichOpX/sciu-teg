import { Prisma, PrismaClient, Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { receiptWithPerson } from 'prisma/queries'
import { GetReceiptWithPersonResponse } from 'types/receipt'
import { canUnserDo } from 'utils/checkPermissions'
import { intSearch, routePaginate, stringSearch } from 'utils/routePaginate'
// GET|POST /api/receipt
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(
  req: NextApiRequest,
  res: NextApiResponse<GetReceiptWithPersonResponse | string | Receipt>
) {
  const { body, method, query, session } = req

  switch (method) {
    case 'GET':
      if (!canUnserDo(session, 'READ_RECEIPT')) return res.status(403).send(`Can't read this.`)
      try {
        const result = await getReceipts(query, prisma)
        res.json(result)
      } catch (error) {
        res.status(500).end(`Hubo un error:\n${JSON.stringify(error, null, 2)}`)
      }
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

const getReceipts = async (
  query: NextApiRequestQuery,
  prisma: PrismaClient
): Promise<GetReceiptWithPersonResponse> => {
  const { keyword, document } = query
  const searchQuery = stringSearch(keyword)

  // obtenemos TODOS los productos
  const where: Prisma.ReceiptWhereInput = keyword
    ? {
        OR: [
          { person: { docNumber: searchQuery } },
          { person: { firstName: searchQuery } },
          { person: { middleName: searchQuery } },
          { person: { secondLastName: searchQuery } },
          { person: { firstLastName: searchQuery } },
          { id: intSearch(keyword) || intSearch(document) }
        ]
      }
    : {}

  const count = await prisma.receipt.count({ where })
  //obtenemos TODOS los recibos
  // Recibos con información escencial de la persona
  const result = await prisma.receipt.findMany({
    ...receiptWithPerson,
    ...routePaginate(query),
    where
  })
  console.log(result)
  return { count, result }
}
